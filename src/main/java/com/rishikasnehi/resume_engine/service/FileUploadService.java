package com.rishikasnehi.resume_engine.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {
    private final Cloudinary cloudinary;

    public Map<String, String> uploadSingleImage(MultipartFile file) throws IOException{
        log.info("Inside FileUploadService: uploadSingleImage() with file name {}", file.getOriginalFilename());
       Map<String, Object> imageUploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "image"));
       return Map.of("imageUrl", imageUploadResult.get("secure_url").toString());
    }
}
