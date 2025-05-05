package com.example.fixperts.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileStorageService {

    public String storeProfilePicture(MultipartFile file, String userId) throws IOException {
        return storeFile(file, "profiles", userId);
    }

    public List<String> storeServiceImages(List<MultipartFile> files, String serviceId) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String imageUrl = storeFile(file, "services", serviceId);
            imageUrls.add(imageUrl);
        }
        return imageUrls;
    }

    private String storeFile(MultipartFile file, String folder, String prefix) throws IOException {
        Path uploadPath = Paths.get("uploads", folder);
        Files.createDirectories(uploadPath);

        String filename = prefix + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + folder + "/" + filename;
    }
}