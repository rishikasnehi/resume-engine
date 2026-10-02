package com.rishikasnehi.resume_engine.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor 
@NoArgsConstructor 
@Builder
public class AiRewriteResponse {

    private String rewrittenText;
}
