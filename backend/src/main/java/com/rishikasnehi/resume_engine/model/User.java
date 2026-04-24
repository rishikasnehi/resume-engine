package com.rishikasnehi.resume_engine.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    private String id;
    private String name;
    private String email;
    private String password; // In production, ensure this is hashed and not stored in plain text
    private String profileImageUrl;
    @Builder.Default
    private String subscriptionPlan = "FREE"; // Default to FREE, can be upgraded to PREMIUM
    @Builder.Default
    private boolean emailVerified = false; // Indicates if the user's email is verified
    private String verificationToken; // Token for email verification
    private LocalDateTime verificationTokenExpiry; // Expiry time for the verification token

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
