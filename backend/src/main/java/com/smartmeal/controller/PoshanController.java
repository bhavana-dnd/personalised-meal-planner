package com.smartmeal.controller;

import com.smartmeal.facade.MealMonitoringFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/poshan") @RequiredArgsConstructor
public class PoshanController {
    private final MealMonitoringFacade facade;

    /** Get PM POSHAN weekly menu — optionally filter by state */
    @GetMapping("/menu")
    public ResponseEntity<?> menu(@RequestParam(required = false) String state) {
        return ResponseEntity.ok(facade.getPoshanMenu(state));
    }
}
