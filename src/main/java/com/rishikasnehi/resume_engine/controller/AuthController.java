package com.rishikasnehi.resume_engine.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.rishikasnehi.resume_engine.dto.RegisterRequest;
import com.rishikasnehi.resume_engine.dto.RegisterResponse;
import com.rishikasnehi.resume_engine.service.AuthService;
import static com.rishikasnehi.resume_engine.util.AppConstants.AUTH_BASE_URL;
import static com.rishikasnehi.resume_engine.util.AppConstants.REGISTER_URL;
import static com.rishikasnehi.resume_engine.util.AppConstants.VERIFY_EMAIL_URL;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping(AUTH_BASE_URL)
public class AuthController {
    private final AuthService authService;

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
}
