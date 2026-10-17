package com.smartmeal.controller;

import com.smartmeal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/** Resolves the authenticated user's DB id from the JWT principal username. */
@Component
@RequiredArgsConstructor
public class AuthHelper {
    private final UserRepository userRepo;

    public Long userId(Authentication auth) {
        return userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
