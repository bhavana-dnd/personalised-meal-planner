package com.smartmeal.controller;

import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/recommendations") @RequiredArgsConstructor
public class RecommendationController {
    private final MealMonitoringFacade facade;
    private final AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<?> get(Authentication auth,
                                  @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(facade.getRecommendations(authHelper.userId(auth), limit));
    }
}
