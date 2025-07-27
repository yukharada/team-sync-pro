// backend/src/main/java/com/teamsync/backend/controller/AuthController.java
package com.teamsync.backend.controller;

import com.teamsync.backend.dto.auth.AuthResponse;
import com.teamsync.backend.dto.auth.LoginRequest;
import com.teamsync.backend.dto.auth.RegisterRequest;
import com.teamsync.backend.security.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "User login")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        try{
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "User registration")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest){
        try{
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
