package com.rishikasnehi.resume_engine.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rishikasnehi.resume_engine.dto.AiRewriteRequest;
import com.rishikasnehi.resume_engine.dto.AiRewriteResponse;
import com.rishikasnehi.resume_engine.service.AiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.rishikasnehi.resume_engine.util.AppConstants.AI_BASE_URL;
import static com.rishikasnehi.resume_engine.util.AppConstants.REWRITE_BULLET;

@RestController
@RequestMapping(AI_BASE_URL)
@RequiredArgsConstructor
@Slf4j

public class AiController {

    private final AiService aiService;

    @PostMapping(REWRITE_BULLET)
    public ResponseEntity<?> rewriteBullet(@Valid @RequestBody AiRewriteRequest request, Authentication authentication) {

        // Step 1 : Call the service method
        AiRewriteResponse response = aiService.rewriteBullet(request);

        // Step 2 : Return the response
        return ResponseEntity.ok(response);
    }

}
