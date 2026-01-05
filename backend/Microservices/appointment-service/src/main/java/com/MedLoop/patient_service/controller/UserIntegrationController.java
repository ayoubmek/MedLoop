package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.client.UserServiceClient;
import com.MedLoop.patient_service.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient-service/users")
public class UserIntegrationController {

    @Autowired
    private UserServiceClient userServiceClient;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsersFromUserService() {
        List<UserDTO> users = userServiceClient.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserByIdFromUserService(@PathVariable Long id) {
        UserDTO user = userServiceClient.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/test-connection")
    public ResponseEntity<String> testConnection() {
        try {
            List<UserDTO> users = userServiceClient.getAllUsers();
            return ResponseEntity.ok("Connection successful! Found " + users.size() + " users in user-service");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Connection failed: " + e.getMessage());
        }
    }
}
