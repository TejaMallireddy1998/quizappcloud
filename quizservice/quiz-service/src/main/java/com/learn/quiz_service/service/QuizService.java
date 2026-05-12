package com.learn.quiz_service.service;


import com.learn.quiz_service.dao.*;
import com.learn.quiz_service.feign.QuizInterface;
import com.learn.quiz_service.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    QuizDao quizDao;

    @Autowired
    QuizInterface quizInterface;

    @Autowired
    QuizAttemptDao quizAttemptDao;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        try {
            List<Integer> questionIds = quizInterface.getQuestionsForQuiz(category, numQ).getBody();

            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setQuestionIds(questionIds);

            quizDao.save(quiz);

            return new ResponseEntity<>("QUIZ CREATED SUCCESSFULLY", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("QUIZ NOT CREATED ", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        try {
            Quiz quiz = quizDao.getReferenceById(id);
            List<Integer> questionIds = quiz.getQuestionIds();
            List<QuestionWrapper> qw = quizInterface.getQuestionsFromId(questionIds).getBody();

            return new ResponseEntity<>(qw, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<QuizResult> calculateResult(Integer quizId, List<Response> responses, Long userId, Integer timeTakenSeconds) {
        try {
            QuizResult result = quizInterface.getResult(responses).getBody();
            if (result == null) {
                return new ResponseEntity<>(new QuizResult(0, responses.size(), new ArrayList<>()), HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Record the attempt, only if we know who the user is
            if (userId != null) {
                Quiz quiz = quizDao.getReferenceById(quizId);
                int total = quiz.getQuestionIds() != null ? quiz.getQuestionIds().size() : responses.size();

                QuizAttempt attempt = new QuizAttempt();
                attempt.setUserId(userId);
                attempt.setQuizId(quizId);
                attempt.setScore(result.getScore());
                attempt.setTotal(total);
                attempt.setTimeTakenSeconds(timeTakenSeconds);
                quizAttemptDao.save(attempt);
            }

            return new ResponseEntity<>(result, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new QuizResult(0, responses.size(), new ArrayList<>()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<List<QuizAttempt>> getMyAttempts(Long userId) {
        try {
            List<QuizAttempt> attempts = quizAttemptDao.findByUserIdOrderByAttemptedAtDesc(userId);
            return new ResponseEntity<>(attempts, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<List<QuizSummary>> listQuizzes() {
        try {
            List<QuizSummary> summaries = quizDao.findAll().stream()
                    .map(q -> new QuizSummary(
                            q.getId(),
                            q.getTitle(),
                            q.getQuestionIds() == null ? 0 : q.getQuestionIds().size()
                    ))
                    .toList();
            return new ResponseEntity<>(summaries, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> deleteQuiz(Integer id) {
        try {
            if (!quizDao.existsById(id)) {
                return new ResponseEntity<>("QUIZ NOT FOUND", HttpStatus.NOT_FOUND);
            }
            quizDao.deleteById(id);
            return new ResponseEntity<>("QUIZ DELETED SUCCESSFULLY", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("DELETE FAILED", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}