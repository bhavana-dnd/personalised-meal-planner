package com.smartmeal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "weight_entries")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WeightEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double weightKg;

    @Column(nullable = false)
    private LocalDate date;

    private String notes;
}
