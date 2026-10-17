package com.smartmeal.controller;

import com.smartmeal.dto.MealDtos.*;
import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealMonitoringFacade facade;
    private final AuthHelper authHelper;

    @PostMapping
    public ResponseEntity<?> logMeal(Authentication auth, @RequestBody LogMealRequest req) {
        return ResponseEntity.ok(facade.logMeal(authHelper.userId(auth), req));
    }

    @GetMapping("/today")
    public ResponseEntity<?> today(Authentication auth) {
        return ResponseEntity.ok(facade.getTodaysMeals(authHelper.userId(auth)));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(
            Authentication auth,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(7)}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(facade.getHistory(authHelper.userId(auth), from, to));
    }
}
