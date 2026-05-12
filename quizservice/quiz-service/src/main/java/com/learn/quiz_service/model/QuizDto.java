package com.learn.quiz_service.model;

import lombok.Data;

@Data
public class QuizDto {

    // Dto - data transfer object

    private String categoryName;
    private Integer numQ;
    private String title;

    public QuizDto() {
    }

    public QuizDto(String categoryName, Integer numQ, String title) {
        this.categoryName = categoryName;
        this.numQ = numQ;
        this.title = title;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getNumQ() {
        return numQ;
    }

    public void setNumQ(Integer numQ) {
        this.numQ = numQ;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "QuizDto{" +
                "categoryName='" + categoryName + '\'' +
                ", numQ=" + numQ +
                ", title='" + title + '\'' +
                '}';
    }
}
