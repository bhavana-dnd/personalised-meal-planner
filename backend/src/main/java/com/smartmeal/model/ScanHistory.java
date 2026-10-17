package com.smartmeal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Records every food scan the user performs via Google Vision API.
 * Linked to the matched Food entity if found in our database.
 */
@Entity @Table(name = "scan_history")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ScanHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Raw Vision API response labels (comma-separated)
    @Column(length = 1000)
    private String detectedLabels;

    // Best matched food name from our DB (may be null if no match)
    private String matchedFoodName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_id")
    private Food matchedFood;

    private Double confidenceScore; // 0.0 – 1.0

    @Builder.Default
    private LocalDateTime scannedAt = LocalDateTime.now();

    // Base64 thumbnail stored for history display
    @Column(columnDefinition = "TEXT")
    private String imageThumbnail;

    private Boolean loggedToMeal; // did user log this after scanning?
}
