package com.rishikasnehi.resume_engine.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.rishikasnehi.resume_engine.dto.LoginRequest;
import com.rishikasnehi.resume_engine.dto.RegisterRequest;
import com.rishikasnehi.resume_engine.dto.RegisterResponse;
import com.rishikasnehi.resume_engine.service.AuthService;
import com.rishikasnehi.resume_engine.service.FileUploadService;

import static com.rishikasnehi.resume_engine.util.AppConstants.AUTH_BASE_URL;
import static com.rishikasnehi.resume_engine.util.AppConstants.REGISTER_URL;
import static com.rishikasnehi.resume_engine.util.AppConstants.VERIFY_EMAIL_URL;
import static com.rishikasnehi.resume_engine.util.AppConstants.UPLOAD_PROFILE;
import static com.rishikasnehi.resume_engine.util.AppConstants.LOGIN;
import static com.rishikasnehi.resume_engine.util.AppConstants.RESEND_VERIFICATION;



import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.Objects; // 


@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping(AUTH_BASE_URL)
public class AuthController {
    private final AuthService authService;
    private final FileUploadService fileUploadService;

    @PostMapping(REGISTER_URL)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Inside AuthController: register() with request {}", request);
        RegisterResponse response = authService.register(request);
        log.info("Response from service: {}", response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping(VERIFY_EMAIL_URL)
    public ResponseEntity<?> verifyEmail (@RequestParam String token) {
        log.info("Inside AuthController: verifyEmail() with token {}", token);
        authService.verifyEmail(token);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Email verified successfully"));
    }

    @PostMapping(UPLOAD_PROFILE)
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        log.info("Inside AuthController: uploadImage() with file name {}", file.getOriginalFilename());
        Map<String, String> response = fileUploadService.uploadSingleImage(file);
        return ResponseEntity.ok(response);   
    }

    @PostMapping(LOGIN)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        RegisterResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Remove at end...not necccessary, just to test token validation
    @GetMapping("/validate")
    public String testValidationToken() {
        return "Token is valid!"; 
    }

    @PostMapping(RESEND_VERIFICATION)
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> body) { 
        String email = body.get("email");

        if(Objects.isNull(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        authService.resendVerificationEmail(email);
        return ResponseEntity.ok(Map.of("success", "true", "message", "Verification email resent successfully"));

    }

}
