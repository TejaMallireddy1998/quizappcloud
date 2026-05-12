package com.learn.question_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


public class QuizResult {
    private int score;
    private int total;
    private List<QuestionResult> breakdown;

    public QuizResult() {
    }

    public QuizResult(int score, int total, List<QuestionResult> breakdown) {
        this.score = score;
        this.total = total;
        this.breakdown = breakdown;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<QuestionResult> getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(List<QuestionResult> breakdown) {
        this.breakdown = breakdown;
    }

    @Override
    public String toString() {
        return "QuizResult{" +
                "score=" + score +
                ", total=" + total +
                ", breakdown=" + breakdown +
                '}';
    }
}