package com.example.learning_project.service;

import com.example.learning_project.controller.AdminController;
import com.example.learning_project.controller.TrackingController;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;


@ApplicationPath("/api")
public class Api extends Application{
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(AdminController.class);
        classes.add(TrackingController.class); // Add your resource classes here
        classes.add(CORSFilter.class); // Register the CORSFilter class
        return classes;
    }
}


