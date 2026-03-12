package com.liclam.lexinsurance.controller;

import java.util.Map;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.liclam.lexinsurance.dto.LoginRequest;
import com.liclam.lexinsurance.dto.RegisterRequest;
import com.liclam.lexinsurance.entity.User;
import com.liclam.lexinsurance.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            authService.registerInitial(req);
            return ResponseEntity.ok(Map.of("message", "Código enviado a tu correo."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> payload) {
        try {
            authService.verifyAndSave(payload.get("email"), payload.get("code"));
            return ResponseEntity.ok(Map.of("message", "Cuenta creada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        try {
            authService.initiatePasswordRecovery(payload.get("email"));
            return ResponseEntity.ok(Map.of("message", "Código de recuperación enviado."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            authService.resetPassword(payload.get("email"), payload.get("code"), payload.get("newPassword"));
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            User user = authService.login(req);
            return ResponseEntity.ok(Map.of("id", user.getId(), "email", user.getEmail(), "fullName", user.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}