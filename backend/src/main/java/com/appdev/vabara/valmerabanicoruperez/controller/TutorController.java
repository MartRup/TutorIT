package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tutors")
public class TutorController {

    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @GetMapping
    public ResponseEntity<List<TutorEntity>> getAllTutors() {
        return ResponseEntity.ok(tutorService.getAllTutors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorEntity> getTutorById(@PathVariable("id") Long tutorId) {
        Optional<TutorEntity> tutor = tutorService.findById(tutorId);
        return tutor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TutorEntity> createTutor(@RequestBody TutorEntity tutor) {
        TutorEntity saved = tutorService.saveTutor(tutor);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutorEntity> updateTutor(@PathVariable("id") Long tutorId,
                                             @RequestBody TutorEntity updatedTutor) {
        Optional<TutorEntity> existingTutor = tutorService.findById(tutorId);
        if (existingTutor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TutorEntity tutor = existingTutor.get();
        tutor.setName(updatedTutor.getName());
        tutor.setEmail(updatedTutor.getEmail());
        tutor.setPassword(updatedTutor.getPassword());
        tutor.setExpertiseSubjects(updatedTutor.getExpertiseSubjects());
        tutor.setHourlyRate(updatedTutor.getHourlyRate());

        TutorEntity savedTutor = tutorService.saveTutor(tutor);
        return ResponseEntity.ok(savedTutor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutor(@PathVariable("id") Long tutorId) {
        if (!tutorService.existsById(tutorId)) {
            return ResponseEntity.notFound().build();
        }
        tutorService.deleteTutor(tutorId);
        return ResponseEntity.noContent().build();
    }
}
