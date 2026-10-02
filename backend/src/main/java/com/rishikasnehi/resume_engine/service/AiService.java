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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service 
@RequiredArgsConstructor 
@Slf4j 
public class AiService {

    private final RestClient geminiRestClient;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String geminiModel;

    private static final int MAX_INPUT_LENGTH = 1000; // Define a maximum input length

    public AiRewriteResponse rewriteBullet(AiRewriteRequest request) {

        //Step 1: Validate the input text
        String rawText = request.getRawText() == null ? "" : request.getRawText().trim();
        
        if(rawText.isEmpty()) {
            throw new AiServiceException("Input text cannot be empty.");
        }

        if(rawText.length() > MAX_INPUT_LENGTH) {
            throw new AiServiceException("Input text exceeds maximum length of " + MAX_INPUT_LENGTH + " characters.");
        }
                
        //Step 2 : Build the prompt for the AI model
        String prompt = buildPrompt(request.getSectionType(), rawText);

        String rewritten = callGemini(prompt);

        return AiRewriteResponse.builder()
                .rewrittenText(rewritten)
                .build();
    }

    private String buildPrompt(String sectionType, String rawText) {
        String context = "PROJECT".equalsIgnoreCase(sectionType)
            ? "project description"
            : "work experience description";

        return "You are an expert resume writer. Rewrite the following " + context +
                " into a single, strong resume bullet point. " +
                "Start with a powerful action verb, keep it to one or two lines, " +
                "quantify impact with realistic numbers only if the original text implies them, " +
                "and avoid vague buzzwords. " +
                "Return ONLY the rewritten bullet point text — no quotes, no labels, no explanation.\n\n" +
                "Original text: \"" + rawText + "\"";
    }

    public String callGemini(String prompt) {
        try {
            JSONObject part = new JSONObject().put("text", prompt);
            JSONObject content = new JSONObject().put("parts", new JSONArray().put(part));
            JSONObject requestBody = new JSONObject().put("contents", new JSONArray().put(content));

            String path = "/models/" + geminiModel + ":generateContent?key=" + geminiApiKey;

            String responseBody = geminiRestClient.post()
                    .uri(path)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody.toString())
                    .retrieve()
                    .body(String.class);

            return extractText(responseBody);

        } catch (AiServiceException ex) {
            throw ex; // already a clean, user-facing message — don't wrap it again
        } catch (Exception ex) {
            log.error("Gemini API call failed", ex);
            throw new AiServiceException("AI rewrite failed. Please try again in a moment.", ex);
        }
    }

    private String extractText(String responseBody) {
        JSONObject json = new JSONObject(responseBody);
        JSONArray candidates = json.optJSONArray("candidates");

        if (candidates == null || candidates.length() == 0) {
            throw new AiServiceException("AI did not return a valid response. Please try again.");
        }

        JSONObject firstCandidate = candidates.getJSONObject(0);
        JSONObject content = firstCandidate.getJSONObject("content");
        JSONArray parts = content.getJSONArray("parts");

        return parts.getJSONObject(0).getString("text").trim();
    }

}   
