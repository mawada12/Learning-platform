package com.example.learning_project.service;
import com.example.learning_project.entity.Review;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class ReviewService {
    @PersistenceContext
    private EntityManager em;

    public void createReview(Review review) {
        em.persist(review);
    }

    public List<Review> getReviewsByCourse(Long courseId) {
        return em.createQuery("SELECT r FROM Review r WHERE r.course.id = :courseId", Review.class)
                .setParameter("courseId", courseId)
                .getResultList();
    }
}