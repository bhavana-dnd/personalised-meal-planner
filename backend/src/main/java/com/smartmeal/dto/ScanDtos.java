package com.smartmeal.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class ScanDtos {

    @Data
    public static class ScanRequest {
        private String base64Image;      // raw base64, no header
        private String mimeType;         // image/jpeg or image/png
    }

    @Data @Builder
    public static class ScanResultResponse {
        private Long scanId;
        private boolean matched;
        private Double confidence;
        private List<String> detectedLabels;
        private String matchedLabel;
        private Long foodId;
        private String foodName;
        private String category;
        private List<String> tags;
        private String description;
        private Boolean isPoshanMeal;
        private String poshanState;
        private NutritionPer100g nutrition;
        private String message;
    }

    @Data @Builder
    public static class NutritionPer100g {
        private Double calories;
        private Double protein;
        private Double carbs;
        private Double fat;
        private Double fibre;
        private Double sugar;
        private Double sodium;
    }

    @Data @Builder
    public static class ScanHistoryItem {
        private Long scanId;
        private String matchedFoodName;
        private Double confidence;
        private LocalDateTime scannedAt;
        private Boolean loggedToMeal;
    }
}
