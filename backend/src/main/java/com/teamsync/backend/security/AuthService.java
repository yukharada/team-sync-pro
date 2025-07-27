package com.teamsync.backend.security;

import com.teamsync.backend.dto.auth.AuthResponse;
import com.teamsync.backend.dto.auth.LoginRequest;
import com.teamsync.backend.dto.auth.RegisterRequest;
import com.teamsync.backend.entity.User;
import com.teamsync.backend.repository.UserRepository;
import com.teamsync.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest loginRequest){
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                           loginRequest.getUsername(),
                           loginRequest.getPassword()
                    )
            );
        }catch (BadCredentialsException e){
            throw new RuntimeException("Invalid credentials", e);
        }

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getId(),
                user.getRole().name()
        );

        return  new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        );
    }

    public AuthResponse register(RegisterRequest registerRequest){
        if(userRepository.existsByUsername(registerRequest.getUsername())){
            throw new RuntimeException("Username is already taken!");
        }

        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Email is already in use!");
        }

        // パスワードをハッシュ化する
        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encodedPassword);
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(
                savedUser.getUsername(),
                savedUser.getId(),
                savedUser.getRole().name()
        );

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole().name()
        );
    }
}
