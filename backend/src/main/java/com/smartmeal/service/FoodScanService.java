package com.smartmeal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartmeal.decorator.FoodComponent;
import com.smartmeal.decorator.FoodDecoratorService;
import com.smartmeal.dto.ScanDtos.*;
import com.smartmeal.model.Food;
import com.smartmeal.model.ScanHistory;
import com.smartmeal.model.User;
import com.smartmeal.repository.FoodRepository;
import com.smartmeal.repository.ScanHistoryRepository;
import com.smartmeal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Google Cloud Vision API integration for food scanning.
 *
 * Flow:
 *   1. Send base64 image to Vision API → get label annotations
 *   2. Match detected labels against food.visionLabels in our DB
 *   3. Apply Decorator pattern to add nutrition tags
 *   4. Save scan to ScanHistory
 *   5. Return matched food + full nutrition breakdown
 *
 * Dataset note: Our food DB includes visionLabels mapped from the
 * Food-101 dataset labels (https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/)
 * and Indian Food Dataset labels for PM POSHAN meals.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FoodScanService {

    @Value("${app.vision.api-key}")
    private String apiKey;

    @Value("${app.vision.endpoint}")
    private String endpoint;

    private final FoodRepository foodRepository;
    private final ScanHistoryRepository scanHistoryRepository;
    private final UserRepository userRepository;
    private final FoodDecoratorService decoratorService;
    private final NutritionCalculator calculator;
    private final ObjectMapper objectMapper;

    /**
     * Main scan method.
     * @param userId     authenticated user
     * @param base64Image base64-encoded image (without data:image/... prefix)
     * @param mimeType   "image/jpeg" or "image/png"
     * @return scan result with matched food + nutrition
     */
    public ScanResultResponse scan(Long userId, String base64Image, String mimeType) {
        // 1. Call Vision API
        List<VisionLabel> labels = callVisionApi(base64Image, mimeType);
        String detectedStr = labels.stream()
                .map(l -> l.description + "(" + String.format("%.2f", l.score) + ")")
                .collect(Collectors.joining(", "));

        log.info("[FoodScan] User={} detected labels: {}", userId, detectedStr);

        // 2. Match to food in DB
        FoodMatch match = matchFoodFromLabels(labels);

        // 3. Apply decorators if matched
        String tags = "";
        String description = "";
        if (match.food != null) {
            FoodComponent decorated = decoratorService.decorate(match.food);
            tags = decorated.getTags();
            description = decorated.getDescription();
        }

        // 4. Save scan history
        User user = userRepository.findById(userId).orElseThrow();
        ScanHistory history = ScanHistory.builder()
                .user(user)
                .detectedLabels(detectedStr)
                .matchedFoodName(match.food != null ? match.food.getName() : null)
                .matchedFood(match.food)
                .confidenceScore(match.confidence)
                .imageThumbnail(base64Image.length() > 200
                        ? base64Image.substring(0, 200) : base64Image) // store thumbnail only
                .loggedToMeal(false)
                .build();
        scanHistoryRepository.save(history);

        // 5. Build response
        if (match.food == null) {
            return ScanResultResponse.builder()
                    .scanId(history.getId())
                    .matched(false)
                    .detectedLabels(labels.stream().map(l -> l.description).collect(Collectors.toList()))
                    .message("No matching food found in our database. Try adjusting the image or search manually.")
                    .build();
        }

        Food f = match.food;
        return ScanResultResponse.builder()
                .scanId(history.getId())
                .matched(true)
                .confidence(match.confidence)
                .detectedLabels(labels.stream().map(l -> l.description).collect(Collectors.toList()))
                .matchedLabel(match.matchedLabel)
                .foodId(f.getId())
                .foodName(f.getName())
                .category(f.getCategory())
                .tags(Arrays.stream(tags.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList()))
                .description(description)
                .isPoshanMeal(f.getIsPoshanMeal())
                .poshanState(f.getPoshanState())
                .nutrition(NutritionPer100g.builder()
                        .calories(f.getCaloriesPer100g())
                        .protein(f.getProteinPer100g())
                        .carbs(f.getCarbsPer100g())
                        .fat(f.getFatPer100g())
                        .fibre(f.getFibrePer100g())
                        .sugar(f.getSugarPer100g())
                        .sodium(f.getSodiumPer100g())
                        .build())
                .message("Found: " + f.getName() + ". Add to your meal log?")
                .build();
    }

    /** Call Google Cloud Vision API with LABEL_DETECTION */
    private List<VisionLabel> callVisionApi(String base64Image, String mimeType) {
        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE")) {
            log.warn("[FoodScan] Vision API key not set — using demo mode");
            return demoPredictions();
        }

        try {
            String body = String.format("""
                {
                  "requests": [{
                    "image": {"content": "%s"},
                    "features": [
                      {"type": "LABEL_DETECTION", "maxResults": 10},
                      {"type": "WEB_DETECTION", "maxResults": 5}
                    ]
                  }]
                }
                """, base64Image);

            String response = WebClient.create()
                    .post()
                    .uri(endpoint + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseVisionResponse(response);
        } catch (Exception e) {
            log.error("[FoodScan] Vision API error: {}", e.getMessage());
            return List.of();
        }
    }

    private List<VisionLabel> parseVisionResponse(String json) {
        List<VisionLabel> labels = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode annotations = root.path("responses").get(0).path("labelAnnotations");
            if (annotations.isArray()) {
                for (JsonNode n : annotations) {
                    labels.add(new VisionLabel(
                            n.path("description").asText(),
                            n.path("score").asDouble()
                    ));
                }
            }
            // Also include web entities as labels
            JsonNode webEntities = root.path("responses").get(0)
                    .path("webDetection").path("webEntities");
            if (webEntities.isArray()) {
                for (JsonNode n : webEntities) {
                    String desc = n.path("description").asText();
                    double score = n.path("score").asDouble(0.5);
                    if (!desc.isBlank()) labels.add(new VisionLabel(desc, score * 0.8));
                }
            }
        } catch (Exception e) {
            log.error("[FoodScan] Parse error: {}", e.getMessage());
        }
        return labels;
    }

    /** Match Vision labels to our food database */
    private FoodMatch matchFoodFromLabels(List<VisionLabel> labels) {
        for (VisionLabel label : labels) {
            // Direct name match
            var exact = foodRepository.findByNameIgnoreCase(label.description);
            if (exact.isPresent()) return new FoodMatch(exact.get(), label.description, label.score);

            // visionLabels field match
            List<Food> matches = foodRepository.findByVisionLabel(label.description);
            if (!matches.isEmpty()) return new FoodMatch(matches.get(0), label.description, label.score);

            // Fuzzy: check if label contains any food name word
            String labelLower = label.description.toLowerCase();
            List<Food> all = foodRepository.search(labelLower);
            if (!all.isEmpty()) return new FoodMatch(all.get(0), label.description, label.score * 0.8);
        }
        return new FoodMatch(null, null, 0.0);
    }

    /** Demo predictions when API key not set */
    private List<VisionLabel> demoPredictions() {
        return List.of(
                new VisionLabel("Rice", 0.95),
                new VisionLabel("Dal", 0.88),
                new VisionLabel("Indian cuisine", 0.82),
                new VisionLabel("Food", 0.98)
        );
    }

    public List<ScanHistoryItem> getScanHistory(Long userId) {
        return scanHistoryRepository.findByUserIdOrderByScannedAtDesc(userId).stream()
                .map(h -> ScanHistoryItem.builder()
                        .scanId(h.getId())
                        .matchedFoodName(h.getMatchedFoodName())
                        .confidence(h.getConfidenceScore())
                        .scannedAt(h.getScannedAt())
                        .loggedToMeal(h.getLoggedToMeal())
                        .build())
                .collect(Collectors.toList());
    }

    // Inner helpers
    private record VisionLabel(String description, double score) {}
    private record FoodMatch(Food food, String matchedLabel, double confidence) {}
}
