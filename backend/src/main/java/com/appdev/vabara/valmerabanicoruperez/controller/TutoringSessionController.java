package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.TutoringSessionEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.TutoringSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tutoring-sessions")
public class TutoringSessionController {

    private final TutoringSessionRepository tutoringSessionRepository;

    public TutoringSessionController(TutoringSessionRepository tutoringSessionRepository) {
        this.tutoringSessionRepository = tutoringSessionRepository;
    }

    @GetMapping
    public List<TutoringSessionEntity> getAllTutoringSessions() {
        return tutoringSessionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutoringSessionEntity> getTutoringSessionById(@PathVariable("id") String sessionId) {
        Optional<TutoringSessionEntity> tutoringSession = tutoringSessionRepository.findById(sessionId);
        return tutoringSession.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TutoringSessionEntity createTutoringSession(@RequestBody TutoringSessionEntity tutoringSession) {
        return tutoringSessionRepository.save(tutoringSession);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutoringSessionEntity> updateTutoringSession(
            @PathVariable("id") String sessionId,
            @RequestBody TutoringSessionEntity updatedSession) {
        if (!tutoringSessionRepository.existsById(sessionId)) {
            return ResponseEntity.notFound().build();
        }
        updatedSession.setSessionId(sessionId);
        TutoringSessionEntity savedSession = tutoringSessionRepository.save(updatedSession);
        return ResponseEntity.ok(savedSession);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutoringSession(@PathVariable("id") String sessionId) {
        if (!tutoringSessionRepository.existsById(sessionId)) {
            return ResponseEntity.notFound().build();
        }
        tutoringSessionRepository.deleteById(sessionId);
        return ResponseEntity.noContent().build();
    }
}
