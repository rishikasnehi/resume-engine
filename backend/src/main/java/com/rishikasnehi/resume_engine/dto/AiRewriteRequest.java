package com.rishikasnehi.resume_engine.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AiRewriteRequest {

    @NotBlank(message = "Section type is required")
    private String sectionType;

    @NotBlank(message = "Content is required")
    private String rawText;
}
