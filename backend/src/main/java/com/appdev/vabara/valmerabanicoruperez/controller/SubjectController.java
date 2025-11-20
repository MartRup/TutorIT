package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.Subject;
import com.appdev.vabara.valmerabanicoruperez.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        Subject createdSubject = subjectService.addSubject(subject);
        return ResponseEntity.ok(createdSubject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubject(@PathVariable Long id) {
        Subject subject = subjectService.findSubjectById(id);
        return ResponseEntity.ok(subject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        Subject updatedSubject = subjectService.updateSubject(id, subject);
        return ResponseEntity.ok(updatedSubject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectService.findAllSubjects();
        return ResponseEntity.ok(subjects);
    }
}
