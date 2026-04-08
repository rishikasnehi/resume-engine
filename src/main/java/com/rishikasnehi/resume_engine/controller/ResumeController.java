package com.rishikasnehi.resume_engine.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rishikasnehi.resume_engine.dto.CreateResumeRequest;
import com.rishikasnehi.resume_engine.model.Resume;
import com.rishikasnehi.resume_engine.service.FileUploadService;
import com.rishikasnehi.resume_engine.service.ResumeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.rishikasnehi.resume_engine.util.AppConstants.ID;
import static com.rishikasnehi.resume_engine.util.AppConstants.RESUME;
import static com.rishikasnehi.resume_engine.util.AppConstants.UPLOAD_IMAGES;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(RESUME)
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;
    private final FileUploadService fileUploadService;

    // Create a new resume for the user
    @PostMapping
    public ResponseEntity<?> createResume(@Valid@RequestBody CreateResumeRequest request, Authentication authentication) {

        //Step 1 : Call the service method 
        Resume newResume = resumeService.createResume(request, authentication.getPrincipal());

        //Step 2 : Return the response
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
    }

    // Get all resumes for the authenticated user
    @GetMapping
    public ResponseEntity<?> getUserResume(Authentication authentication) {

        // Step 1 : Call the service method to get all resumes for the user
        List<Resume> resumes = resumeService.getUserResumes(authentication.getPrincipal());

        // Step 2 : Return the response
        return ResponseEntity.ok(resumes);
    }

    // Get a specific resume by ID
    @GetMapping(ID)
    public ResponseEntity<?> getResumeById(@PathVariable String id, Authentication authentication) {

        // Step 1 : Call the service method to get the resume by ID
        Resume existingResume = resumeService.getResumeById(id, authentication.getPrincipal());

        // Step 2 : Return the response
        return ResponseEntity.ok(existingResume);
    }

    // Update an existing resume
    @PutMapping(ID)
    public ResponseEntity<?> updateResume(@PathVariable String id, @RequestBody Resume updatedData, Authentication authentication) {
        
        // Step 1 : Call the service method to update the resume
        Resume updatedResume = resumeService.updateResume(id, updatedData, authentication.getPrincipal());

        // Step 2 : Return the response
        return ResponseEntity.ok(updatedResume);
    }

    // Upload thumbnail and profile images for a resume
    @PutMapping(UPLOAD_IMAGES)
    public ResponseEntity<?> uploadResumeImages(@PathVariable String id, @RequestPart (value = "thumbnail", required = false) MultipartFile thumbnail, @RequestPart (value = "profileImage", required = false) MultipartFile profileImage, Authentication authentication) throws IOException {
        
        // Step 1 : Call the service method to upload the images and update the resume
        Map<String, String> response = fileUploadService.uploadResumeImages(id, thumbnail, profileImage, authentication.getPrincipal());

        // Step 2 : Return the response
        return ResponseEntity.ok(response);
    }

    // Delete a resume by ID
    @DeleteMapping(ID)
    public ResponseEntity<?> deleteResume(@PathVariable String id, Authentication authentication) {

            // Step 1 : Call the service method to delete the resume (not implemented here)
            resumeService.deleteResume(id, authentication.getPrincipal());
    
            // Step 2 : Return the response
            return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));

    }
}
