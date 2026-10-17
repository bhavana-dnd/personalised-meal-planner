package com.smartmeal.controller;

import com.smartmeal.dto.ScanDtos.ScanRequest;
import com.smartmeal.service.FoodScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/scan") @RequiredArgsConstructor
public class ScanController {
    private final FoodScanService scanService;
    private final AuthHelper authHelper;

    /** POST base64 image → Vision API → matched food + nutrition */
    @PostMapping
    public ResponseEntity<?> scan(Authentication auth, @RequestBody ScanRequest req) {
        return ResponseEntity.ok(
            scanService.scan(authHelper.userId(auth), req.getBase64Image(),
                             req.getMimeType() != null ? req.getMimeType() : "image/jpeg"));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(Authentication auth) {
        return ResponseEntity.ok(scanService.getScanHistory(authHelper.userId(auth)));
    }
}
