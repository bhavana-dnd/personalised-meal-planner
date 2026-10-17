package com.smartmeal.controller;

import com.smartmeal.dto.MealDtos.WeightRequest;
import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/weight") @RequiredArgsConstructor
public class WeightController {
    private final MealMonitoringFacade facade;
    private final AuthHelper authHelper;

    @PostMapping
    public ResponseEntity<?> log(Authentication auth, @RequestBody WeightRequest req) {
        return ResponseEntity.ok(facade.logWeight(authHelper.userId(auth), req));
    }

    @GetMapping
    public ResponseEntity<?> history(Authentication auth) {
        return ResponseEntity.ok(facade.getWeightHistory(authHelper.userId(auth)));
    }
}
