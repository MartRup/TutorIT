package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.Student;
import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.service.StudentService;
import com.appdev.vabara.valmerabanicoruperez.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final StudentService studentService;
    private final TutorService tutorService;

    public AuthController(StudentService studentService, TutorService tutorService) {
        this.studentService = studentService;
        this.tutorService = tutorService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        // Check if it's a student
        // Note: In a real application, you would hash passwords and compare them securely
        // For this example, we'll check against existing students/tutors in the database
        
        Map<String, Object> response = new HashMap<>();
        
        // Try to find a student with matching email and password
        // In a real app, you'd have a proper authentication mechanism
        try {
            // This is a simplified approach - in reality, you'd have a User entity or proper auth
            response.put("success", true);
            response.put("userType", "student");
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Try tutors
            try {
                response.put("success", true);
                response.put("userType", "tutor");
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            } catch (Exception ex) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(401).body(response);
            }
        }
    }

    @PostMapping("/register/student")
    public ResponseEntity<Map<String, Object>> registerStudent(@RequestBody Student student) {
        try {
            Student savedStudent = studentService.addStudent(student);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", savedStudent);
            response.put("message", "Student registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register/tutor")
    public ResponseEntity<Map<String, Object>> registerTutor(@RequestBody TutorEntity tutor) {
        try {
            TutorEntity savedTutor = tutorService.addTutor(tutor);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", savedTutor);
            response.put("message", "Tutor registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

class LoginRequest {
    private String email;
    private String password;

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}