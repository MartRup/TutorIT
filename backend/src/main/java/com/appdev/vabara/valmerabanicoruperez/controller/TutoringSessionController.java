package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.TutoringSessionEntity;
import com.appdev.vabara.valmerabanicoruperez.service.TutoringSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tutoring-sessions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TutoringSessionController {

    private final TutoringSessionService tutoringSessionService;

    public TutoringSessionController(TutoringSessionService tutoringSessionService) {
        this.tutoringSessionService = tutoringSessionService;
    }

    @GetMapping
    public List<TutoringSessionEntity> getAllTutoringSessions() {
        return tutoringSessionService.findAllTutoringSessions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutoringSessionEntity> getTutoringSessionById(@PathVariable("id") String sessionId) {
        try {
            TutoringSessionEntity tutoringSession = tutoringSessionService.findTutoringSessionById(sessionId);
            return ResponseEntity.ok(tutoringSession);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public TutoringSessionEntity createTutoringSession(@RequestBody TutoringSessionEntity tutoringSession) {
        return tutoringSessionService.addTutoringSession(tutoringSession);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutoringSessionEntity> updateTutoringSession(
            @PathVariable("id") String sessionId,
            @RequestBody TutoringSessionEntity updatedSession) {
        try {
            TutoringSessionEntity tutoringSession = tutoringSessionService.updateTutoringSession(sessionId,
                    updatedSession);
            return ResponseEntity.ok(tutoringSession);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutoringSession(@PathVariable("id") String sessionId) {
        try {
            tutoringSessionService.deleteTutoringSession(sessionId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
