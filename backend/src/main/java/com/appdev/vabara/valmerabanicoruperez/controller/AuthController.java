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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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

        Map<String, Object> response = new HashMap<>();

        try {
            String userType = null;
            boolean authenticated = false;

            // Check if user is a student
            java.util.Optional<Student> studentOpt = studentService.getStudentRepository().findByEmail(email);
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                // In production, use password hashing (BCrypt)
                if (password.equals(student.getPassword())) {
                    userType = "student";
                    authenticated = true;
                }
            }

            // If not found as student, check if user is a tutor
            if (!authenticated) {
                java.util.Optional<TutorEntity> tutorOpt = tutorService.getTutorRepository().findByEmail(email);
                if (tutorOpt.isPresent()) {
                    TutorEntity tutor = tutorOpt.get();
                    // In production, use password hashing (BCrypt)
                    if (password.equals(tutor.getPassword())) {
                        userType = "tutor";
                        authenticated = true;
                    }
                }
            }

            if (!authenticated) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(response);
            }

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
            response.put("message", "An error occurred during login: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
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
    public ResponseEntity<Map<String, Object>> status(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract user information from JWT token
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                String userType = jwtUtil.extractUserType(token);

                response.put("authenticated", true);
                response.put("email", email);
                response.put("role", userType);

                // Fetch actual user data from database
                if ("student".equals(userType)) {
                    java.util.Optional<Student> studentOpt = studentService.getStudentRepository().findByEmail(email);
                    if (studentOpt.isPresent()) {
                        Student student = studentOpt.get();
                        response.put("userId", student.getId());
                        response.put("name", student.getName());
                    }
                } else if ("tutor".equals(userType)) {
                    java.util.Optional<TutorEntity> tutorOpt = tutorService.getTutorRepository().findByEmail(email);
                    if (tutorOpt.isPresent()) {
                        TutorEntity tutor = tutorOpt.get();
                        response.put("userId", tutor.getTutorId());
                        response.put("name", tutor.getName());
                    }
                }

                return ResponseEntity.ok(response);
            } else {
                response.put("authenticated", false);
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("authenticated", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract user information from JWT token
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                String userType = jwtUtil.extractUserType(token);

                response.put("email", email);
                response.put("userType", userType);
                response.put("authenticated", true);

                // Fetch actual user data from database
                Map<String, Object> user = new HashMap<>();
                
                if ("student".equals(userType)) {
                    java.util.Optional<Student> studentOpt = studentService.getStudentRepository().findByEmail(email);
                    if (studentOpt.isPresent()) {
                        Student student = studentOpt.get();
                        user.put("id", student.getId());
                        user.put("name", student.getName());
                        user.put("email", student.getEmail());
                        user.put("phoneNumber", ""); // Students don't have phone number in current model
                        user.put("bio", "");
                        user.put("education", "");
                        user.put("yearsOfExperience", 0);
                        user.put("subjects", new String[] {});
                    }
                } else if ("tutor".equals(userType)) {
                    java.util.Optional<TutorEntity> tutorOpt = tutorService.getTutorRepository().findByEmail(email);
                    if (tutorOpt.isPresent()) {
                        TutorEntity tutor = tutorOpt.get();
                        user.put("id", tutor.getTutorId());
                        user.put("name", tutor.getName());
                        user.put("email", tutor.getEmail());
                        user.put("phoneNumber", ""); // Tutors don't have phone number in current model
                        user.put("bio", "");
                        user.put("education", tutor.getInstitution());
                        user.put("yearsOfExperience", tutor.getExperience());
                        user.put("subjects", tutor.getExpertiseSubjects() != null ? 
                            tutor.getExpertiseSubjects().split(",") : new String[] {});
                    }
                }

                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                response.put("authenticated", false);
                response.put("message", "Invalid or missing token");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("authenticated", false);
            response.put("message", "Error fetching user data: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
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