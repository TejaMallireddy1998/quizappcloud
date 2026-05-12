package com.learn.auth_service.dto;


import java.util.Set;


public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private Set<String> roles;
    private long expiresInSeconds;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long userId, String username, Set<String> roles, long expiresInSeconds) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.roles = roles;
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(long expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "token='" + token + '\'' +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", roles=" + roles +
                ", expiresInSeconds=" + expiresInSeconds +
                '}';
    }
}