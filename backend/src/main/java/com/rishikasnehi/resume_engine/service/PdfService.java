package com.rishikasnehi.resume_engine.service;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.rishikasnehi.resume_engine.model.Resume;
@Service
public class PdfService {

    public byte[] generateResumePdf(Resume resume) {

        String html = """
            <html>
            <body>
                <h1>%s</h1>
                <h3>%s</h3>
                <p>%s</p>
            </body>
            </html>
        """.formatted(
                resume.getProfileInfo().getFullName(),
                resume.getProfileInfo().getDesignation(),
                resume.getProfileInfo().getSummary()
        );

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();

            return os.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF");
        }
    }
}