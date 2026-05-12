package com.learn.question_service.service;


import com.learn.question_service.dao.QuestionDao;
import com.learn.question_service.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {
    @Autowired
    QuestionDao questionDao;

    public ResponseEntity <List<Question>> getAllQuestions() {

        try {
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category) {
        try {
            return new ResponseEntity<>(questionDao.findByCategory(category),HttpStatus.OK);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<String> addQuestion(Question question) {
        try {
            questionDao.save(question);
            return new ResponseEntity<>( "ADDED SUCCESSFULLY",HttpStatus.CREATED);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>("NOT ADDED",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> deleteQuestionById(Integer id) {
        try {


            questionDao.deleteById(id);
            return new ResponseEntity<>("DELETED SUCCESSFULLY",HttpStatus.OK);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>("NOT DELETED",HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> updateQuestion(Integer id, Question updatedQuestion) {
        try {


            Question oldQuestion = questionDao.getReferenceById(id);

            if (updatedQuestion == null)
                return new ResponseEntity<>( "QUESTION NOT FOUND",HttpStatus.NOT_FOUND);


            oldQuestion.setQuestionTitle(updatedQuestion.getQuestionTitle());
            oldQuestion.setCategory(updatedQuestion.getCategory());
            oldQuestion.setDifficultyLevel(updatedQuestion.getDifficultyLevel());
            oldQuestion.setOption1(updatedQuestion.getOption1());
            oldQuestion.setOption2(updatedQuestion.getOption2());
            oldQuestion.setOption3(updatedQuestion.getOption3());
            oldQuestion.setOption4(updatedQuestion.getOption4());
            oldQuestion.setRightAnswer(updatedQuestion.getRightAnswer());
            questionDao.save(oldQuestion);


            return new ResponseEntity<>( "UPDATED QUESTION SUCCESSFULLY",HttpStatus.OK);
        }
        catch (Exception e){
            e.printStackTrace();

        }
        return new ResponseEntity<>( "QUESTION NOT FOUND",HttpStatus.NOT_FOUND);
    }


    public ResponseEntity<List<Integer>> getQuestionsForQuiz(String categoryName, Integer numQuestions) {
        try{
            List<Integer> questions = questionDao.findRandomQuestionsByCategory(categoryName,numQuestions);
            return new ResponseEntity<>( questions,HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>( new ArrayList<>(),HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromIds(List<Integer> questionIds) {
        try {
            List<QuestionWrapper> wrappers = new ArrayList<>();
            List<Question> questions = new ArrayList<>();

            for(Integer qId : questionIds){
                questions.add(questionDao.getReferenceById(qId));
            }
            for (Question q : questions){
                QuestionWrapper w = new QuestionWrapper();
                w.setId(q.getId());
                w.setQuestionTitle(q.getQuestionTitle());
                w.setOption1(q.getOption1());
                w.setOption2(q.getOption2());
                w.setOption3(q.getOption3());
                w.setOption4(q.getOption4());
                wrappers.add(w);
            }
            return new ResponseEntity<>(wrappers,HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
        }

        return new ResponseEntity<>( new ArrayList<>(),HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<Integer> getScore(List<Response> responses) {
        try {

            int right = 0;

            for(Response rs: responses){
                Question q = questionDao.getReferenceById(rs.getId());
                    if(rs.getId().equals(q.getId())&&
                            rs.getResponse().equals(q.getRightAnswer())){

                        right++;
                    }
                }

            return new ResponseEntity<>(right,HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(0, HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<QuizResult> getResult(List<Response> responses) {
        try {
            List<QuestionResult> breakdown = new ArrayList<>();
            int right = 0;

            for (Response rs : responses) {
                Question q = questionDao.findById(rs.getId()).orElse(null);
                if (q == null) continue;

                boolean isCorrect = rs.getResponse() != null
                        && rs.getResponse().equals(q.getRightAnswer());
                if (isCorrect) right++;

                breakdown.add(new QuestionResult(
                        q.getId(),
                        q.getQuestionTitle(),
                        rs.getResponse(),
                        q.getRightAnswer(),
                        isCorrect
                ));
            }

            QuizResult result = new QuizResult(right, responses.size(), breakdown);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(
                new QuizResult(0, 0, new ArrayList<>()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}
