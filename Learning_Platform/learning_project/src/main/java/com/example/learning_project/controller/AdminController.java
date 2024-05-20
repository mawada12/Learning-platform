package com.example.learning_project.controller;

import com.example.learning_project.entity.CourseObj;

import javax.inject.Inject;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.*;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import jakarta.ejb.Stateful;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Map;

@RequestScoped
@Stateful
@Path("/admin")
public class AdminController {


    // Default no-argument constructor is required for CDI
    public AdminController() {
    }

    @POST
    @Path("/approveCourse")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response approveCourse(Map<String, Object> request) {
        CloseableHttpClient client = HttpClients.createDefault();
        Response response;

        try {
            String apiUrl = "http://localhost:3001/api/courses/approveCourse"; // Assuming this is your Node.js API endpoint

            HttpPost httpPost = new HttpPost(apiUrl);
            httpPost.addHeader("Content-Type", "application/json");

            String courseId = (String) request.get("id");
            System.out.println(courseId);
            String jsonPayload = "{\"id\":\"" + courseId + "\"}";
            StringEntity entity = new StringEntity(jsonPayload);
            httpPost.setEntity(entity);

            CloseableHttpResponse response2 = client.execute(httpPost);
            int statusCode = response2.getStatusLine().getStatusCode();
            HttpEntity responseEntity = response2.getEntity();

            if (statusCode == Response.Status.OK.getStatusCode() && responseEntity != null) {
                String entity2 = EntityUtils.toString(responseEntity);
                response = Response.status(Response.Status.OK).entity(entity2)

                        .build();
            } else {
                response = Response.status(statusCode).entity("Failed to approve course")

                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error")

                    .build();
        } finally {
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return response;
    }

    @PUT
    @Path("/editCourse/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editCourse(@PathParam("id") String id, CourseObj course) {
        CloseableHttpClient client = HttpClients.createDefault();
        Response response;

        try {
            String apiUrl = "http://localhost:3001/api/courses/edit-course/" + id; // Assuming this is your Node.js API endpoint

            HttpPut httpPost = new HttpPut(apiUrl);
            httpPost.addHeader("Content-Type", "application/json");

            System.out.println(course.name);
            String jsonCourse = new Gson().toJson(course);
            System.out.println(jsonCourse);
            // Set the request body
            StringEntity entity = new StringEntity(jsonCourse);
            System.out.println(entity);
            httpPost.setEntity(entity);

            CloseableHttpResponse response2 = client.execute(httpPost);
            int statusCode = response2.getStatusLine().getStatusCode();
            HttpEntity responseEntity = response2.getEntity();

            if (statusCode == Response.Status.OK.getStatusCode() && responseEntity != null) {
                String entity2 = EntityUtils.toString(responseEntity);
                response = Response.status(Response.Status.OK).entity(entity2)

                        .build();
            } else {
                response = Response.status(statusCode).entity("Failed to approve course")

                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error")

                    .build();
        } finally {
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return response;
    }

    @GET
    @Path("/viewUsers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response viewUsers() {
        Client client = ClientBuilder.newClient();
        Response response;

        try {
            javax.ws.rs.core.Response apiResponse = client.target("http://localhost:3005/api/users/users")
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            if (apiResponse.getStatus() == Response.Status.OK.getStatusCode()) {
                String entity = apiResponse.readEntity(String.class);
                response = Response.status(Response.Status.OK).entity(entity)

                        .build();
            } else {
                response = Response.status(apiResponse.getStatus()).entity("Failed to fetch courses")

                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error")

                    .build();
        } finally {
            client.close();
        }

        return response;
    }

    @GET
    @Path("/viewCourse")
    @Produces(MediaType.APPLICATION_JSON)
    public Response viewCourse() {
        Client client = ClientBuilder.newClient();
        Response response;

        try {
            javax.ws.rs.core.Response apiResponse = client.target("http://localhost:3001/api/courses/coursesFordmin")
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            if (apiResponse.getStatus() == Response.Status.OK.getStatusCode()) {
                String entity = apiResponse.readEntity(String.class);
                response = Response.status(Response.Status.OK).entity(entity)

                        .build();
            } else {
                response = Response.status(apiResponse.getStatus()).entity("Failed to fetch courses")

                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error")

                    .build();
        } finally {
            client.close();
        }

        return response;
    }
}
