package com.smartmeal.controller;

import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {
    private final MealMonitoringFacade facade;

    @GetMapping
    public ResponseEntity<?> search(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(facade.searchFoods(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facade.getFoodById(id));
    }
}
