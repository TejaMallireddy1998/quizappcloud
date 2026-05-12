package com.learn.auth_service.service;

import com.learn.auth_service.dao.UserDao;
import com.learn.auth_service.dto.LoginRequest;
import com.learn.auth_service.dto.LoginResponse;
import com.learn.auth_service.dto.RegisterRequest;
import com.learn.auth_service.dto.UserResponse;
import com.learn.auth_service.model.User;
import com.learn.auth_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserResponse register(RegisterRequest req) {
        if (userDao.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userDao.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        // Always assign USER role. Admins are created manually via SQL (bootstrap),
// or later via an admin-only "promote" endpoint.
        user.setRoles(Set.of("USER"));

        User saved = userDao.save(user);
        return new UserResponse(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getRoles());
    }

    public LoginResponse login(LoginRequest req) {
        User user = userDao.findByUsername(req.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRoles());
        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getRoles(),
                jwtUtil.getExpirationSeconds()
        );
    }

    public UserResponse getMe(Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }
}