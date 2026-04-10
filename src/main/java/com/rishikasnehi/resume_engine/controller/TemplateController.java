package com.rishikasnehi.resume_engine.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rishikasnehi.resume_engine.service.TemplateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/template")
@Slf4j
public class TemplateController {
    
    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<?> getTemplates(Authentication authentication) {
        // Step 1 : Call the service method to get all templates for the user
        Map<String, Object> response = templateService.getTemplates(authentication.getPrincipal());

        // Step 2 : Return the response
        return ResponseEntity.ok(response);
    }
}
