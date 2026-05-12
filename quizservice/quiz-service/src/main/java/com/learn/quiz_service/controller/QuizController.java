package com.learn.quiz_service.controller;


import com.learn.quiz_service.model.*;
import com.learn.quiz_service.security.SecurityHeaders;
import com.learn.quiz_service.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("quiz")
public class QuizController {

    @Autowired
    QuizService quizService;

    // ADMIN-only
    @PostMapping("create")
    public ResponseEntity<?> createQuiz(
            @RequestBody QuizDto quizDto,
            @RequestHeader(value = "X-User-Roles", required = false) String rolesHeader
    ) {
        if (!SecurityHeaders.hasRole(rolesHeader, "ADMIN")) {
            return new ResponseEntity<>(Map.of("error", "ADMIN role required"), HttpStatus.FORBIDDEN);
        }
        return quizService.createQuiz(quizDto.getCategoryName(), quizDto.getNumQ(), quizDto.getTitle());
    }

    // Any authenticated user
    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id) {
        return quizService.getQuizQuestions(id);
    }

    // Any authenticated user — records attempt using user ID from Gateway
    @PostMapping("submit/{id}")
    public ResponseEntity<QuizResult> submitQuiz(
            @PathVariable Integer id,
            @RequestBody List<Response> responses,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestHeader(value = "X-Time-Taken-Seconds", required = false) Integer timeTakenSeconds
    ) {
        Long userId = SecurityHeaders.getUserId(userIdHeader);
        return quizService.calculateResult(id, responses, userId, timeTakenSeconds);
    }

    // Any authenticated user — list all available quizzes
    @GetMapping("list")
    public ResponseEntity<List<QuizSummary>> listQuizzes() {
        return quizService.listQuizzes();
    }

    // Get the authenticated user's attempt history
    @GetMapping("attempts")
    public ResponseEntity<?> getMyAttempts(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader
    ) {
        Long userId = SecurityHeaders.getUserId(userIdHeader);
        if (userId == null) {
            return new ResponseEntity<>(Map.of("error", "Authentication required"), HttpStatus.UNAUTHORIZED);
        }
        return quizService.getMyAttempts(userId);
    }

    // ADMIN-only
    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteQuiz(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Roles", required = false) String rolesHeader
    ) {
        if (!SecurityHeaders.hasRole(rolesHeader, "ADMIN")) {
            return new ResponseEntity<>(Map.of("error", "ADMIN role required"), HttpStatus.FORBIDDEN);
        }
        return quizService.deleteQuiz(id);
    }
}