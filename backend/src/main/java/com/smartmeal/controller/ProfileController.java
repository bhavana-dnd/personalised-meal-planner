package com.smartmeal.controller;

import com.smartmeal.dto.MealDtos.ProfileRequest;
import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final MealMonitoringFacade facade;
    private final AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<?> get(Authentication auth) {
        return ResponseEntity.ok(facade.getProfile(authHelper.userId(auth)));
    }

    @PutMapping
    public ResponseEntity<?> update(Authentication auth, @RequestBody ProfileRequest req) {
        return ResponseEntity.ok(facade.updateProfile(authHelper.userId(auth), req));
    }
}
