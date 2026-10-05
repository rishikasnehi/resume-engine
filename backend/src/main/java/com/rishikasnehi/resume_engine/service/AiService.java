package com.rishikasnehi.resume_engine.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.rishikasnehi.resume_engine.dto.AiRewriteRequest;
import com.rishikasnehi.resume_engine.dto.AiRewriteResponse;
import com.rishikasnehi.resume_engine.exception.AiServiceException;
import com.rishikasnehi.resume_engine.model.Resume;
import com.rishikasnehi.resume_engine.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final RestClient geminiRestClient;
    private final ResumeRepository resumeRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-2.5-flash}")
    private String geminiModel;

    private static final int MAX_INPUT_LENGTH = 1000;

    public AiRewriteResponse rewriteBullet(
            String resumeId,
            AiRewriteRequest request) {

        // --------------------------------------------------
        // Step 1: Validate resumeId
        // --------------------------------------------------

        if (resumeId == null || resumeId.trim().isEmpty()) {
            throw new AiServiceException("Resume ID is required.");
        }

        // --------------------------------------------------
        // Step 2: Validate input text
        // --------------------------------------------------

        String rawText = request.getRawText() == null
                ? ""
                : request.getRawText().trim();

        if (rawText.isEmpty()) {
            throw new AiServiceException("Input text cannot be empty.");
        }

        if (rawText.length() > MAX_INPUT_LENGTH) {
            throw new AiServiceException(
                    "Input text exceeds maximum length of "
                    + MAX_INPUT_LENGTH
                    + " characters."
            );
        }

        // --------------------------------------------------
        // Step 3: Validate section type
        // --------------------------------------------------

        String sectionType = request.getSectionType() == null
                ? ""
                : request.getSectionType().trim();

        if (sectionType.isEmpty()) {
            throw new AiServiceException("Section type is required.");
        }

        // --------------------------------------------------
        // Step 4: Find resume in MongoDB
        // --------------------------------------------------

        Resume resume = resumeRepository
                .findById(resumeId.trim())
                .orElseThrow(() ->
                        new AiServiceException("Resume not found.")
                );

        // --------------------------------------------------
        // Step 5: Normalize section type
        // --------------------------------------------------

        String normalizedSectionType =
                normalizeSectionType(sectionType);

        // --------------------------------------------------
        // Step 6: Check whether section exists
        // --------------------------------------------------

        validateSectionExists(
                resume,
                normalizedSectionType
        );

        // --------------------------------------------------
        // Step 7: Build prompt
        // --------------------------------------------------

        String prompt = buildPrompt(
                normalizedSectionType,
                rawText
        );

        // --------------------------------------------------
        // Step 8: Call Gemini
        // --------------------------------------------------

        String rewritten = callGemini(prompt);

        // --------------------------------------------------
        // Step 9: Return response
        // --------------------------------------------------

        return AiRewriteResponse.builder()
                .rewrittenText(rewritten)
                .build();
    }

    // ======================================================
    // Normalize section type
    // ======================================================

    private String normalizeSectionType(String sectionType) {

        return sectionType
                .trim()
                .replace("-", "_")
                .replace(" ", "_")
                .toUpperCase();
    }

    // ======================================================
    // Validate section exists in the resume
    // ======================================================

    private void validateSectionExists(
            Resume resume,
            String sectionType) {

        boolean exists = switch (sectionType) {

            case "PROFILE", "PROFILE_INFO" ->
                    resume.getProfileInfo() != null;

            case "CONTACT", "CONTACT_INFO" ->
                    resume.getContactInfo() != null;

            case "WORK_EXPERIENCE", "WORKEXPERIENCE" ->
                    resume.getWorkExperience() != null
                    && !resume.getWorkExperience().isEmpty();

            case "EDUCATION" ->
                    resume.getEducation() != null
                    && !resume.getEducation().isEmpty();

            case "SKILL", "SKILLS" ->
                    resume.getSkills() != null
                    && !resume.getSkills().isEmpty();

            case "PROJECT", "PROJECTS" ->
                    resume.getProjects() != null
                    && !resume.getProjects().isEmpty();

            case "CERTIFICATION", "CERTIFICATIONS" ->
                    resume.getCertifications() != null
                    && !resume.getCertifications().isEmpty();

            case "LANGUAGE", "LANGUAGES" ->
                    resume.getLanguages() != null
                    && !resume.getLanguages().isEmpty();

            case "INTEREST", "INTERESTS" ->
                    resume.getInterests() != null
                    && !resume.getInterests().isEmpty();

            default ->
                    false;
        };

        if (!exists) {
            throw new AiServiceException(
                    "Invalid section type: " + sectionType
            );
        }
    }

    // ======================================================
    // Build Gemini Prompt
    // ======================================================

    private String buildPrompt(
            String sectionType,
            String rawText) {

        String context = switch (sectionType) {

            case "PROJECT", "PROJECTS" ->
                    "project description";

            case "WORK_EXPERIENCE", "WORKEXPERIENCE" ->
                    "work experience description";

            case "EDUCATION" ->
                    "education description";

            case "SKILL", "SKILLS" ->
                    "skills description";

            case "CERTIFICATION", "CERTIFICATIONS" ->
                    "certification description";

            case "LANGUAGE", "LANGUAGES" ->
                    "language description";

            case "INTEREST", "INTERESTS" ->
                    "interest description";

            case "PROFILE", "PROFILE_INFO" ->
                    "profile description";

            case "CONTACT", "CONTACT_INFO" ->
                    "contact information";

            default ->
                    "resume section description";
        };

        return "You are an expert resume writer. "
                + "Rewrite the following "
                + context
                + " into a single, strong resume bullet point. "
                + "Start with a powerful action verb, "
                + "keep it to one or two lines, "
                + "and improve clarity and impact. "
                + "Quantify impact only when the original text "
                + "supports it. "
                + "Never invent technologies, responsibilities, "
                + "achievements, metrics, numbers, outcomes, "
                + "or other facts that are not present "
                + "or reasonably implied by the original text. "
                + "Return ONLY the rewritten bullet point text "
                + "— no quotes, no labels, no explanation.\n\n"
                + "Original text: \""
                + rawText
                + "\"";
    }

    // ======================================================
    // Call Gemini API
    // ======================================================

    public String callGemini(String prompt) {

        try {

            JSONObject part = new JSONObject()
                    .put("text", prompt);

            JSONObject content = new JSONObject()
                    .put(
                            "parts",
                            new JSONArray().put(part)
                    );

            JSONObject requestBody = new JSONObject()
                    .put(
                            "contents",
                            new JSONArray().put(content)
                    );

            String path =
                    "/models/"
                    + geminiModel
                    + ":generateContent?key="
                    + geminiApiKey;

            String responseBody =
                    geminiRestClient.post()
                            .uri(path)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(requestBody.toString())
                            .retrieve()
                            .body(String.class);

            return extractText(responseBody);

        } catch (AiServiceException ex) {

            // Already a clean user-facing error
            throw ex;

        } catch (Exception ex) {

            log.error("Gemini API call failed", ex);

            throw new AiServiceException(
                    "AI rewrite failed. Please try again in a moment.",
                    ex
            );
        }
    }

    // ======================================================
    // Extract generated text from Gemini response
    // ======================================================

    private String extractText(String responseBody) {

        JSONObject json =
                new JSONObject(responseBody);

        JSONArray candidates =
                json.optJSONArray("candidates");

        if (candidates == null || candidates.length() == 0) {

            throw new AiServiceException(
                    "AI did not return a valid response. Please try again."
            );
        }

        JSONObject firstCandidate =
                candidates.getJSONObject(0);

        JSONObject content =
                firstCandidate.getJSONObject("content");

        JSONArray parts =
                content.getJSONArray("parts");

        return parts
                .getJSONObject(0)
                .getString("text")
                .trim();
    }
}