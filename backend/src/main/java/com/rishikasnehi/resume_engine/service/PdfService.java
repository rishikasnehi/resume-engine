package com.rishikasnehi.resume_engine.service;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.rishikasnehi.resume_engine.model.Resume;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final SpringTemplateEngine templateEngine;

    public byte[] generateResumePdf(Resume resume) {

        String fullName = resume.getProfileInfo() != null
                ? resume.getProfileInfo().getFullName()
                : "";

        String designation = resume.getProfileInfo() != null
                ? resume.getProfileInfo().getDesignation()
                : "";

        String summary = resume.getProfileInfo() != null
                ? resume.getProfileInfo().getSummary()
                : "";

        String email = resume.getContactInfo() != null
                ? resume.getContactInfo().getEmail()
                : "";

        String phone = resume.getContactInfo() != null
                ? resume.getContactInfo().getPhone()
                : "";

        String location = resume.getContactInfo() != null
                ? resume.getContactInfo().getLocation()
                : "";

        String linkedIn = resume.getContactInfo() != null
                ? resume.getContactInfo().getLinkedIn()
                : "";

        String github = resume.getContactInfo() != null
                ? resume.getContactInfo().getGithub()
                : "";

        String website = resume.getContactInfo() != null
                ? resume.getContactInfo().getWebsite()
                : "";

        Context context = new Context();

        context.setVariable("fullName", fullName);
        context.setVariable("designation", designation);
        context.setVariable("summary", summary);

        context.setVariable("email", email);
        context.setVariable("phone", phone);
        context.setVariable("location", location);

        context.setVariable("linkedIn", linkedIn);
        context.setVariable("github", github);
        context.setVariable("website", website);

        context.setVariable("skills", resume.getSkills());
        context.setVariable("education", resume.getEducation());
        context.setVariable("workExperience", resume.getWorkExperience());
        context.setVariable("projects", resume.getProjects());

        context.setVariable("certifications", resume.getCertifications());
        context.setVariable("languages", resume.getLanguages());
        context.setVariable("interests", resume.getInterests());

        String html = templateEngine.process(
                "resume-template",
                context
        );

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {

            PdfRendererBuilder builder = new PdfRendererBuilder();

            builder.withHtmlContent(html, null);

            builder.toStream(os);

            builder.run();

            return os.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}