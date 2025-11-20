package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.Tutor;
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
    public ResponseEntity<List<Tutor>> getAllTutors() {
        return ResponseEntity.ok(tutorService.getAllTutors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> getTutorById(@PathVariable("id") Long tutorId) {
        Optional<Tutor> tutor = tutorService.findById(tutorId);
        return tutor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tutor> createTutor(@RequestBody Tutor tutor) {
        Tutor saved = tutorService.saveTutor(tutor);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutor> updateTutor(@PathVariable("id") Long tutorId,
                                             @RequestBody Tutor updatedTutor) {
        Optional<Tutor> existingTutor = tutorService.findById(tutorId);
        if (existingTutor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tutor tutor = existingTutor.get();
        tutor.setName(updatedTutor.getName());
        tutor.setEmail(updatedTutor.getEmail());
        tutor.setPassword(updatedTutor.getPassword());
        tutor.setExpertiseSubjects(updatedTutor.getExpertiseSubjects());
        tutor.setHourlyRate(updatedTutor.getHourlyRate());

        Tutor savedTutor = tutorService.saveTutor(tutor);
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
