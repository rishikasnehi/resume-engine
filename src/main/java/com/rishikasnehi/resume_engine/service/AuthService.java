package com.rishikasnehi.resume_engine.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rishikasnehi.resume_engine.dto.LoginRequest;
import com.rishikasnehi.resume_engine.dto.RegisterRequest;
import com.rishikasnehi.resume_engine.dto.RegisterResponse;
import com.rishikasnehi.resume_engine.exception.ResourceExistsException;
import com.rishikasnehi.resume_engine.model.User;
import com.rishikasnehi.resume_engine.repository.UserRepository;
import com.rishikasnehi.resume_engine.util.Jwtutil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final Jwtutil jwtutil;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    public RegisterResponse register(RegisterRequest request) {
        log.info("Inside AuthService: register()");

        // Check if user with the same email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceExistsException("User with email " + request.getEmail() + " already exists");
        }

        // Create new user
        User newUser = buildUser(request);

        // Save user to the database
        User savedUser = userRepository.save(newUser);

        // Send verification email with the token (not implemented here)
        sendVerificationEmail(savedUser);

        // Create response object
        return buildRegisterResponse(savedUser);
    }

    public void verifyEmail(String token) {

        log.info("Inside AuthService: verifyEmail() with token {}", token);

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        if (user.getVerificationTokenExpiry() != null && user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setVerificationTokenExpiry( null);
        userRepository.save(user);
    }

    private void sendVerificationEmail(User user) {
        log.info("Inside AuthService: sendVerificationEmail() for user {}", user);
        String subject = "Verify your email";
        try {
            String link = appBaseUrl + "/api/auth/verify-email?token=" + user.getVerificationToken();
            String htmlContent = "<div style='font-family: sans-serif'>" +
                            "<h2>Verify your email</h2>" +
                            "<p>Hi " + user.getName() + ", please confirm your email to activate your account </p>" +
                            "<p><a href='" + link
                            + "' style='display: inline-block;padding:10px 16px;background:#6366f1; color:#fff;border-radius:4px;text-decoration:none;'>Verify Email</a></p>" +
                            "<p>Or copy this link: " + link + "</p>" +
                            "<p>This link expires in 24 hours.</p>" +
                            "</div>";
            emailService.sendHtmlEmail(user.getEmail(), subject, htmlContent);
        } catch (Exception e) {
            log.error("Failed to send verification email to " + user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    private User buildUser(RegisterRequest request) {
        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // In production, hash the password before saving
                .profileImageUrl(request.getProfileImageUrl())
                .emailVerified(false) // Set to false by default, can be updated after email verification
                .verificationToken(UUID.randomUUID().toString())
                .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();
    }

    private RegisterResponse buildRegisterResponse(User user) {
        return RegisterResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .subscriptionPlan(user.getSubscriptionPlan())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
    
    public RegisterResponse login(LoginRequest request) {
        User existingUser = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User with email " + request.getEmail() + " not found"));

        if(!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            // Generate JWT token or session (not implemented here)
            throw new UsernameNotFoundException("Invalid Email or password");
        }

        if(!existingUser.isEmailVerified()) {
            throw new RuntimeException("Email is not verified");
        }

            String token = jwtutil.generateToken(existingUser.getId());
            RegisterResponse response = buildRegisterResponse(existingUser);
            response.setToken(token);
            return response;
    }

}
