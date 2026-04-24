package com.rishikasnehi.resume_engine.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rishikasnehi.resume_engine.dto.CreateResumeRequest;
import com.rishikasnehi.resume_engine.dto.RegisterResponse;
import com.rishikasnehi.resume_engine.model.Resume;
import com.rishikasnehi.resume_engine.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthService authService;

    public Resume createResume(CreateResumeRequest request, Object principalObject) {

        // Step 1 : Create a new Resume object and set the fields
        Resume newResume = new Resume();

        // Step 2 : Get the current profile
        RegisterResponse response = authService.getProfile(principalObject);

        // Step 3 : Update the reumse object
        newResume.setUserId(response.getId());
        newResume.setTitle(request.getTitle());

        // Step 4 : Set default data for the resume
        setDefaultResumeData(newResume);

        // Step 5 : Save the resume to the database
        return resumeRepository.save(newResume);
    }

    public List<Resume> getUserResumes(Object principalObject) {

        // Step 1 : Get the current profile
        RegisterResponse response = authService.getProfile(principalObject);

        // Step 2 : Fetch all resumes for the user from the database(call the repository method)
        List <Resume> resumes =resumeRepository.findByUserIdOrderByCreatedAtDesc(response.getId());

        // Step 3 : Return the list of resumes
        return resumes;
    }

    public Resume getResumeById(String resumeId, Object principalObject) {

        // Step 1 : Get the current profile
        RegisterResponse response = authService.getProfile(principalObject);

        // Step 2 : Fetch the resume by ID from the database (call the repository method)
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found with id: " + resumeId));

        // Step 3 : Return the resume
        return existingResume;
    }

    public Resume updateResume(String resumeId, Resume updatedData, Object principalObject) {

        // Step 1 : Get the current profile
        RegisterResponse response = authService.getProfile(principalObject);

        // Step 2 : Fetch the existing resume by ID from the database (call the repository method)
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found with id: " + resumeId));

        // Step 3 : Update the fields of the existing resume with the new data
        existingResume.setTitle(updatedData.getTitle());
        existingResume.setThumbNailLink(updatedData.getThumbNailLink());
        existingResume.setTemplate(updatedData.getTemplate());
        existingResume.setProfileInfo(updatedData.getProfileInfo());
        existingResume.setContactInfo(updatedData.getContactInfo());
        existingResume.setEducation(updatedData.getEducation());
        existingResume.setWorkExperience(updatedData.getWorkExperience());
        existingResume.setSkills(updatedData.getSkills());
        existingResume.setProjects(updatedData.getProjects());
        existingResume.setCertifications(updatedData.getCertifications());
        existingResume.setLanguages(updatedData.getLanguages());
        existingResume.setInterests(updatedData.getInterests());

        // Step 4 : Save the updated resume to the database and return the result
        resumeRepository.save(existingResume);
        return existingResume;
    }

    public void deleteResume(String resumeId, Object principalObject) {

        // Step 1 : Get the current profile
        RegisterResponse response = authService.getProfile(principalObject);

        // Step 2 : Fetch the existing resume by ID from the database (call the repository method)
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found with id: " + resumeId));

        // Step 3 : Delete the resume from the database
        resumeRepository.delete(existingResume);
    }

    private void setDefaultResumeData(Resume newResume) {
            newResume.setProfileInfo(new Resume.ProfileInfo());
            newResume.setContactInfo(new Resume.ContactInfo());
            newResume.setEducation(new ArrayList<>());
            newResume.setWorkExperience(new ArrayList<>());
            newResume.setSkills(new ArrayList<>());
            newResume.setProjects(new ArrayList<>());
            newResume.setCertifications(new ArrayList<>());
            newResume.setLanguages(new ArrayList<>());
            newResume.setInterests(new ArrayList<>());
            
        }

}
