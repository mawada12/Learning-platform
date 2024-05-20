//package com.example.learning_project.service;
//
//import com.example.learning_project.entity.Course;
//import com.example.learning_project.entity.User;
//
//import javax.ejb.Stateless;
//import javax.persistence.EntityManager;
//import javax.persistence.PersistenceContext;
//import javax.persistence.TypedQuery;
//import java.util.List;
//
//@Stateless
//public class AdminService {
//
//    @PersistenceContext
//    private EntityManager em;
//
//    public void showStatistics() {
//        // Get number of users
//        long numberOfUsers = getCount(User.class);
//
//        // Get number of courses
//        long numberOfCourses = getCount(Course.class);
//
//        // Get popular courses (for example, top 5 courses based on average rating)
//        List<Course> popularCourses = getPopularCourses();
//
//        // Output statistics
//        System.out.println("Number of Users: " + numberOfUsers);
//        System.out.println("Number of Courses: " + numberOfCourses);
//        System.out.println("Popular Courses:");
//        for (int i = 0; i < popularCourses.size(); i++) {
//            System.out.println((i + 1) + ". " + popularCourses.get(i).getTitle());
//        }
//    }
//
//    private long getCount(Class<?> entityClass) {
//        String queryStr = "SELECT COUNT(e) FROM " + entityClass.getSimpleName() + " e";
//        TypedQuery<Long> query = em.createQuery(queryStr, Long.class);
//        return query.getSingleResult();
//    }
//
//    private List<Course> getPopularCourses() {
//        String queryStr = "SELECT c FROM Course c JOIN c.reviews r GROUP BY c.id ORDER BY AVG(r.rating) DESC";
//        TypedQuery<Course> query = em.createQuery(queryStr, Course.class);
//        query.setMaxResults(5);
//        return query.getResultList();
//    }
//}
