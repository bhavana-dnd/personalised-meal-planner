package com.smartmeal.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDtos {
    @Data public static class RegisterRequest {
        @NotBlank @Size(min=3, max=50) private String username;
        @Email @NotBlank private String email;
        @NotBlank @Size(min=6) private String password;
    }
    @Data public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }
    @Data public static class AuthResponse {
        private String token;
        private Long userId;
        private String username;
        private String email;
        public AuthResponse(String token, Long userId, String username, String email) {
            this.token=token; this.userId=userId; this.username=username; this.email=email;
        }
    }
}
