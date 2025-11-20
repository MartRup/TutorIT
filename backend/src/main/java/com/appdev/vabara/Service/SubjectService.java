package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.Subject;
import com.appdev.vabara.valmerabanicoruperez.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Optional<Subject> findById(Long subjectId) {
        return subjectRepository.findById(subjectId);
    }

    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long subjectId) {
        subjectRepository.deleteById(subjectId);
    }

    public boolean existsById(Long subjectId) {
        return subjectRepository.existsById(subjectId);
    }
}
