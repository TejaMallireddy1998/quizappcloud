package com.learn.quiz_service.security;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Reads identity headers added by the API Gateway after validating JWT.
 * Downstream services MUST only be reachable via the Gateway —
 * otherwise these headers could be spoofed.
 */
public class SecurityHeaders {

    public static Long getUserId(String header) {
        if (header == null || header.isBlank()) return null;
        try {
            return Long.parseLong(header);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static List<String> getRoles(String header) {
        if (header == null || header.isBlank()) return Collections.emptyList();
        return Arrays.asList(header.split(","));
    }

    public static boolean hasRole(String header, String role) {
        return getRoles(header).contains(role);
    }
}