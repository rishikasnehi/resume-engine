// package com.rishikasnehi.resume_engine.controller;

// import java.io.IOException;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Objects;

// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestPart;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.multipart.MultipartFile;

// import com.rishikasnehi.resume_engine.service.EmailService;

// import jakarta.mail.MessagingException;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/email")
// @Slf4j
// public class EmailController {
//     private final EmailService emailService;
//     @PostMapping(value = "/send-resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//     public ResponseEntity<Map<String, Object>> sendResumeByEmail(
//             @RequestPart("recipientEmail") String recipientEmail, 
//             @RequestPart("subject") String subject, 
//             @RequestPart("message") String message, 
//             @RequestPart("pdfFile") MultipartFile pdfFile,
//             Authentication authentication) throws IOException, MessagingException {

//                 // Step 1 : Validate the input parameters
//                 Map<String, Object> response = new HashMap<>();
//                 if(Objects.isNull(recipientEmail) || Objects.isNull(pdfFile)) {
//                     response.put("success", false);
//                     response.put("message", "Recipient email and PDF file are required.");
//                     return ResponseEntity.badRequest().body(response);
//                 }

//                 // Step 2 : Get the file data
//                 byte[] pdfBytes = pdfFile.getBytes();
//                 String originalPdfFileName = pdfFile.getOriginalFilename();
//                 String fileName = Objects.nonNull(originalPdfFileName) ? originalPdfFileName : "resume.pdf";
                
//                 // Step 3 : prepare the email content
//                 String emailSubject = Objects.nonNull(subject) ? subject : "Resume";
//                 String emailBody = Objects.nonNull(message) ? message : "Please find the attached resume.\n\nBest regards,\n" + authentication.getName();

//                 // Step 4 : call the email service to send the email with attachment
//                 emailService.sendEmailWithAttachment(recipientEmail, emailSubject, emailBody, pdfBytes, fileName);

//                 // Step 5 : return the response
//                 response.put("success", true);
//                 response.put("message", "Email sent successfully to " + recipientEmail);
//                 return ResponseEntity.ok(response);
//     }
// }



package com.rishikasnehi.resume_engine.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.rishikasnehi.resume_engine.model.Resume;
import com.rishikasnehi.resume_engine.service.EmailService;
import com.rishikasnehi.resume_engine.service.PdfService;
import com.rishikasnehi.resume_engine.service.ResumeService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
@Slf4j
public class EmailController {

    private final EmailService emailService;

    private final ResumeService resumeService;

    private final PdfService pdfService;

    @PostMapping(
            value = "/send-resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, Object>> sendResumeByEmail(

            @RequestPart("recipientEmail")
            String recipientEmail,

            @RequestPart(value = "subject", required = false)
            String subject,

            @RequestPart(value = "message", required = false)
            String message,

            @RequestPart("resumeId")
            String resumeId,

            Authentication authentication

    ) throws IOException, MessagingException {

        // STEP 1 : VALIDATE INPUTS

        Map<String, Object> response =
                new HashMap<>();

        if (Objects.isNull(recipientEmail)
                || Objects.isNull(resumeId)) {

            response.put("success", false);

            response.put(
                    "message",
                    "Recipient email and resumeId are required."
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        // STEP 2 : FETCH RESUME

        Resume resume =
                resumeService.getResumeById(
                        resumeId,
                        authentication.getPrincipal()
                );

        // STEP 3 : GENERATE PDF

        byte[] pdfBytes =
                pdfService.generateResumePdf(resume);

        // STEP 4 : PREPARE EMAIL CONTENT

        String emailSubject =
                Objects.nonNull(subject)
                        ? subject
                        : "Resume";

        String emailBody =
                Objects.nonNull(message)
                        ? message
                        : "Please find attached resume.\n\nBest regards,\n"
                        + authentication.getName();

        // STEP 5 : SEND EMAIL

        emailService.sendEmailWithAttachment(
                recipientEmail,
                emailSubject,
                emailBody,
                pdfBytes,
                "resume.pdf"
        );

        // STEP 6 : SUCCESS RESPONSE

        response.put("success", true);

        response.put(
                "message",
                "Resume sent successfully to "
                        + recipientEmail
        );

        return ResponseEntity.ok(response);
    }
}
