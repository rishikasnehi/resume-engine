
package com.rishikasnehi.resume_engine.service;

import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Value("${BREVO_API_KEY}")
    private String brevoApiKey;

    private final RestClient restClient = RestClient.create();

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlContent) {

        log.info("Sending HTML email to {}", to);

        Map<String, Object> payload = Map.of(
            "sender", Map.of("email", fromEmail),
            "to", List.of(Map.of("email", to)),
            "subject", subject,
            "htmlContent", htmlContent
        );

        sendViaBrevo(payload);
    }

    public void sendEmailWithAttachment(
            String to,
            String subject,
            String body,
            byte[] attachmentData,
            String attachmentName) {

        log.info("Sending email with attachment to {}", to);

        String encodedAttachment =
                Base64.getEncoder().encodeToString(attachmentData);

        Map<String, Object> attachment = Map.of(
            "name", attachmentName,
            "content", encodedAttachment
        );

        Map<String, Object> payload = Map.of(
            "sender", Map.of("email", fromEmail),
            "to", List.of(Map.of("email", to)),
            "subject", subject,
            "textContent", body,
            "attachment", List.of(attachment)
        );

        sendViaBrevo(payload);
    }

    private void sendViaBrevo(Map<String, Object> payload) {
        try {
            restClient.post()
                .uri(BREVO_API_URL)
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();

            log.info("Brevo accepted the email request");

        } catch (Exception e) {
            log.error("Brevo email request failed: {}", e.getMessage());
            throw new IllegalStateException(
                "Failed to send email through Brevo API", e);
        }
    }
}
