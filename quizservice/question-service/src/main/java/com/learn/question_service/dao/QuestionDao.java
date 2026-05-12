package com.learn.question_service.dao;

import com.learn.question_service.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDao extends JpaRepository<Question,Integer> {

    List<Question>  findByCategory(String category);

    @Query(value = "SELECT a.id FROM question a where a.category= ?1" +
            " ORDER BY RANDOM() LIMIT ?2",nativeQuery = true)
    List<Integer> findRandomQuestionsByCategory(String category, int numQ);
}
