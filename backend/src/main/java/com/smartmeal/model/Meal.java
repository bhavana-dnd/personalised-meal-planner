package com.smartmeal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "meals")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Meal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String mealType; // BREAKFAST, LUNCH, SNACK, DINNER

    @Column(nullable = false)
    private LocalDate date;

    @Builder.Default
    private LocalDateTime loggedAt = LocalDateTime.now();

    private String notes;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MealItem> items = new ArrayList<>();

    // Denormalised totals
    @Builder.Default private Double totalCalories = 0.0;
    @Builder.Default private Double totalProtein  = 0.0;
    @Builder.Default private Double totalCarbs    = 0.0;
    @Builder.Default private Double totalFat      = 0.0;
    @Builder.Default private Double totalFibre    = 0.0;
    @Builder.Default private Double totalSodium   = 0.0;
}
