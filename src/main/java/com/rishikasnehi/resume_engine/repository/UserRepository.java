package com.rishikasnehi.resume_engine.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rishikasnehi.resume_engine.model.User;


public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByVerificationToken(String verificationToken);
}
