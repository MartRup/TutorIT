package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.Subject;
import com.appdev.vabara.valmerabanicoruperez.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject addSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public Subject findSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }

    public Subject updateSubject(Long id, Subject subject) {
        Subject existingSubject = findSubjectById(id);
        existingSubject.setTitle(subject.getTitle());
        existingSubject.setCredits(subject.getCredits());
        return subjectRepository.save(existingSubject);
    }

    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }

    public List<Subject> findAllSubjects() {
        return subjectRepository.findAll();
    }
}
