package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
