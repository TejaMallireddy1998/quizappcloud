package com.learn.question_service.security;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SecurityHeaders {

    public static List<String> getRoles(String header) {
        if (header == null || header.isBlank()) return Collections.emptyList();
        return Arrays.asList(header.split(","));
    }

    public static boolean hasRole(String header, String role) {
        return getRoles(header).contains(role);
    }
}