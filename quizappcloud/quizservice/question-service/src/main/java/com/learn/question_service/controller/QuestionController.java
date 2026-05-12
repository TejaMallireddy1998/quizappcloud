package com.learn.question_service.controller;


import com.learn.question_service.model.*;
import com.learn.question_service.security.SecurityHeaders;
import com.learn.question_service.service.QuestionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("question")
public class QuestionController {

    @Autowired
    QuestionService questionService;

    @Autowired
    Environment environment;

    // Read endpoints: any authenticated user
    @GetMapping("allQuestions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        System.out.println(environment.getProperty("local.server.port"));
        return questionService.getAllQuestions();
    }

    @GetMapping("category/{category}")
    public ResponseEntity<List<Question>> getQuestionsByCategory(@PathVariable String category) {
        return questionService.getQuestionsByCategory(category);
    }

    // Write endpoints: ADMIN only
    @PostMapping("add")
    public ResponseEntity<?> addQuestion(
            @RequestBody Question question,
            @RequestHeader(value = "X-User-Roles", required = false) String rolesHeader
    ) {
        if (!SecurityHeaders.hasRole(rolesHeader, "ADMIN")) {
            return new ResponseEntity<>(Map.of("error", "ADMIN role required"), HttpStatus.FORBIDDEN);
        }
        return questionService.addQuestion(question);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteQuestionById(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Roles", required = false) String rolesHeader
    ) {
        if (!SecurityHeaders.hasRole(rolesHeader, "ADMIN")) {
            return new ResponseEntity<>(Map.of("error", "ADMIN role required"), HttpStatus.FORBIDDEN);
        }
        return questionService.deleteQuestionById(id);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable Integer id,
            @RequestBody Question question,
            @RequestHeader(value = "X-User-Roles", required = false) String rolesHeader
    ) {
        if (!SecurityHeaders.hasRole(rolesHeader, "ADMIN")) {
            return new ResponseEntity<>(Map.of("error", "ADMIN role required"), HttpStatus.FORBIDDEN);
        }
        return questionService.updateQuestion(id, question);
    }

    // Internal endpoints called by quiz-service via Feign — NOT protected
    // by role (but still authenticated at the Gateway level)
    @GetMapping("generate")
    public ResponseEntity<List<Integer>> getQuestionsForQuiz(
            @RequestParam String categoryName, @RequestParam Integer numQuestions) {
        return questionService.getQuestionsForQuiz(categoryName, numQuestions);
    }

    @PostMapping("getQuestions")
    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(@RequestBody List<Integer> questionIds) {
        return questionService.getQuestionsFromIds(questionIds);
    }

    @PostMapping("getScore")
    public ResponseEntity<Integer> getScore(@RequestBody List<Response> responses) {
        return questionService.getScore(responses);
    }

    @PostMapping("getResult")
    public ResponseEntity<QuizResult> getResult(@RequestBody List<Response> responses) {
        return questionService.getResult(responses);
    }
}