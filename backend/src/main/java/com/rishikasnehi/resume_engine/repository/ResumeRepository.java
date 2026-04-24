package com.rishikasnehi.resume_engine.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rishikasnehi.resume_engine.model.Resume;

public interface ResumeRepository extends MongoRepository<Resume, String> {
    
    List<Resume> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Resume> findByUserIdAndId(String userId, String id);

    

}
