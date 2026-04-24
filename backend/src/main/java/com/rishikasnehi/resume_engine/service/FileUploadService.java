package com.rishikasnehi.resume_engine.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rishikasnehi.resume_engine.dto.RegisterResponse;
import com.rishikasnehi.resume_engine.model.Resume;
import com.rishikasnehi.resume_engine.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {
    private final Cloudinary cloudinary;
    private final AuthService authService;
    private final ResumeRepository resumeRepository;

    public Map<String, String> uploadSingleImage(MultipartFile file) throws IOException{
        log.info("Inside FileUploadService: uploadSingleImage() with file name {}", file.getOriginalFilename());
       Map<String, Object> imageUploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "image"));
       return Map.of("imageUrl", imageUploadResult.get("secure_url").toString());
    }

    public Map<String, String> uploadResumeImages(String resumeId, MultipartFile thumbnail, MultipartFile profileImage, Object principal) throws IOException {

        // Step 1 : Get the current profile
        RegisterResponse response = authService.getProfile(principal);

        // Step 2 : Fetch the resume from the database and check if it belongs to the user
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                                            .orElseThrow(() -> new RuntimeException("Resume not found or does not belong to the user"));  
                                              
        // Step 3 : Upload the images to Cloudinary and get the URLs
        Map<String, String> returnValue = new HashMap<>();
        Map<String, String> uploadResult;

        if(Objects.nonNull(thumbnail)) {
            uploadResult = uploadSingleImage(thumbnail);
            existingResume.setThumbNailLink(uploadResult.get("imageUrl"));
            returnValue.put("thumbnailLink", uploadResult.get("imageUrl"));
        } 

        if(Objects.nonNull(profileImage)) {
            uploadResult = uploadSingleImage(profileImage);
            if(Objects.isNull(existingResume.getProfileInfo())){
                existingResume.setProfileInfo(new Resume.ProfileInfo());
            }

            existingResume.getProfileInfo().setProfilePreviewUrl(uploadResult.get("imageUrl"));
            returnValue.put("profilePreviewUrl", uploadResult.get("imageUrl"));
        }

        // Step 4 : Save the details to the database and return the response
        resumeRepository.save(existingResume);
        returnValue.put("message", "Images uploaded and resume updated successfully");
        return returnValue;

    }

}
