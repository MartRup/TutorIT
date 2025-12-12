package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.service.TutorService;
import com.appdev.vabara.valmerabanicoruperez.service.TutoringSessionService;
import com.appdev.vabara.valmerabanicoruperez.dto.TutorStatsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/tutors")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TutorController {

    private final TutorService tutorService;
    private final TutoringSessionService tutoringSessionService;

    public TutorController(TutorService tutorService, TutoringSessionService tutoringSessionService) {
        this.tutorService = tutorService;
        this.tutoringSessionService = tutoringSessionService;
    }

    @GetMapping
    public ResponseEntity<List<TutorEntity>> getAllTutors() {
        return ResponseEntity.ok(tutorService.getAllTutors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorEntity> getTutorById(@PathVariable("id") Long tutorId) {
        try {
            TutorEntity tutor = tutorService.findTutorById(tutorId);
            return ResponseEntity.ok(tutor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<TutorEntity> createTutor(@RequestBody TutorEntity tutor) {
        TutorEntity saved = tutorService.addTutor(tutor);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutorEntity> updateTutor(@PathVariable("id") Long tutorId,
            @RequestBody TutorEntity updatedTutor) {
        try {
            TutorEntity tutor = tutorService.updateTutor(tutorId, updatedTutor);
            return ResponseEntity.ok(tutor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/rating")
    public ResponseEntity<TutorEntity> updateTutorRating(@PathVariable("id") Long tutorId,
            @RequestBody Double rating) {
        try {
            TutorEntity tutor = tutorService.updateTutorRating(tutorId, rating);
            return ResponseEntity.ok(tutor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutor(@PathVariable("id") Long tutorId) {
        try {
            tutorService.deleteTutor(tutorId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<TutorStatsDTO> getTutorStats(HttpSession session) {
        try {
            // Get tutor ID from session
            Long tutorId = (Long) session.getAttribute("userId");
            String role = (String) session.getAttribute("role");

            if (tutorId == null || !"tutor".equals(role)) {
                return ResponseEntity.status(403).build();
            }

            TutorStatsDTO stats = tutoringSessionService.getTutorStats(String.valueOf(tutorId));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
