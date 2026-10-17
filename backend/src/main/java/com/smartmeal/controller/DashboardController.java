package com.smartmeal.controller;

import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final MealMonitoringFacade facade;
    private final AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<?> getDashboard(Authentication auth) {
        return ResponseEntity.ok(facade.getDashboard(authHelper.userId(auth)));
    }

    @GetMapping("/targets")
    public ResponseEntity<?> getTargets(Authentication auth) {
        return ResponseEntity.ok(facade.getNutritionTargets(authHelper.userId(auth)));
    }
}
