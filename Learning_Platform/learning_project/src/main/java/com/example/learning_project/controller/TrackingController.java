package com.example.learning_project.controller;

//import com.example.learning_project.service.AdminService;

import javax.inject.Inject;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import com.google.gson.Gson;
import jakarta.ejb.Stateful;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.*;
import javax.ws.rs.core.Response;

@Stateless
@RequestScoped
@Path("/tracking")
public class TrackingController {
    @GET
    @Path("/track")
    @Produces(MediaType.APPLICATION_JSON)
    public Response viewStudents() {
        Client client = ClientBuilder.newClient();
        Response response;

        try {
            javax.ws.rs.core.Response apiResponse = client.target("http://localhost:3001/api/courses/track")
                    .request(MediaType.APPLICATION_JSON)
                    .get();

            if (apiResponse.getStatus() == Response.Status.OK.getStatusCode()) {
                String entity = apiResponse.readEntity(String.class);
                response = Response.status(Response.Status.OK).entity(entity)
                        .build();
            } else {
                response = Response.status(apiResponse.getStatus()).entity("Failed to fetch students")
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
