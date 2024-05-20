package com.example.learning_project.service;
import com.example.learning_project.entity.Course;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class CourseService {
    @PersistenceContext
    private EntityManager em;

    public void createCourse(Course course) {
        em.persist(course);
    }

    public List<Course> getAllCourses() {
        return em.createQuery("SELECT c FROM Course c", Course.class).getResultList();
    }

    public void deleteCourse(Long courseId) {
        Course course = em.find(Course.class, courseId);
        if (course != null) {
            em.remove(course);
        }
    }

    public void publishCourse(Long courseId) {
        Course course = em.find(Course.class, courseId);
        if (course != null) {
            course.setPublished(true);
            em.merge(course);
        }
    }
}