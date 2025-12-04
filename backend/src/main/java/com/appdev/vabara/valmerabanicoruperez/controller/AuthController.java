package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.Student;
import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.service.StudentService;
import com.appdev.vabara.valmerabanicoruperez.service.TutorService;
import com.appdev.vabara.valmerabanicoruperez.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final StudentService studentService;
    private final TutorService tutorService;
    private final JwtUtil jwtUtil;

    public AuthController(StudentService studentService, TutorService tutorService, JwtUtil jwtUtil) {
        this.studentService = studentService;
        this.tutorService = tutorService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        // In a real application, you would hash passwords and compare them securely
        // For this example, we'll simulate authentication
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Simulate authentication - in a real app, you'd check against database
            // For demonstration, we'll assume all logins are successful
            String userType = "student"; // This would be determined by checking the database
            
            // Generate JWT token
            String token = jwtUtil.generateToken(email, userType);
            
            // Create response cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false) // Set to true in production with HTTPS
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 hours
                    .sameSite("Lax")
                    .build();
            
            response.put("success", true);
            response.put("userType", userType);
            response.put("message", "Login successful");
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
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
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        // Clear the JWT cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(0) // Expire immediately
                .sameSite("Lax")
                .build();
        
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", true);
        responseMap.put("message", "Logged out successfully");
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseMap);
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