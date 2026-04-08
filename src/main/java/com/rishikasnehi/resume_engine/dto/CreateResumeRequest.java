package com.rishikasnehi.resume_engine.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateResumeRequest {

    @NotBlank
    private String title;
}
