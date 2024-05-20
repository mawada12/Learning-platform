package com.example.learning_project.entity;

import javax.persistence.*;

@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Course course;

    @ManyToOne
    private User student;

    private String content;
    private int rating;

    // Constructors
    public Review() {
    }

    public Review(Course course, User student, String content, int rating) {
        this.course = course;
        this.student = student;
        this.content = content;
        this.rating = rating;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    // Override toString() for easier debugging
    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", course=" + course +
                ", student=" + student +
                ", content='" + content + '\'' +
                ", rating=" + rating +
                '}';
    }
}
