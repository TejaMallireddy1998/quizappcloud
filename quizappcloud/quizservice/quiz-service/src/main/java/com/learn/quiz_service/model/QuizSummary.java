package com.learn.quiz_service.model;




public class QuizSummary {
    private Integer id;
    private String title;
    private int questionCount;

    public QuizSummary() {
    }

    public QuizSummary(Integer id, String title, int questionCount) {
        this.id = id;
        this.title = title;
        this.questionCount = questionCount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    @Override
    public String toString() {
        return "QuizSummary{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", questionCount=" + questionCount +
                '}';
    }
}