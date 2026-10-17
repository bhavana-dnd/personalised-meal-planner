package com.smartmeal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "user_profiles")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer age;
    private String gender;        // MALE, FEMALE, OTHER
    private Double heightCm;
    private Double weightKg;
    private String activityLevel; // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
    private String goal;          // WEIGHT_LOSS, MUSCLE_GAIN, MAINTENANCE, BALANCED
    private String dietType;      // NONE, VEGETARIAN, VEGAN

    @Column(length = 500)
    private String allergies;     // comma-separated: "nuts,dairy"

    @Column(length = 500)
    private String likedFoods;

    @Column(length = 500)
    private String dislikedFoods;

    // Target beneficiary type: GENERAL, CHILD_POSHAN (PM POSHAN scheme)
    @Builder.Default
    private String userType = "GENERAL";
}
