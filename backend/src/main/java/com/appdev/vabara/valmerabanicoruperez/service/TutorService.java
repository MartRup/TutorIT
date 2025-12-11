package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.TutorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorService {

    private final TutorRepository tutorRepository;

    public TutorService(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    public TutorRepository getTutorRepository() {
        return tutorRepository;
    }

    // Create
    public TutorEntity addTutor(TutorEntity tutor) {
        return tutorRepository.save(tutor);
    }

    // Read - Get all
    public List<TutorEntity> getAllTutors() {
        return tutorRepository.findAll();
    }

    // Read - Get by ID
    public TutorEntity findTutorById(Long id) {
        return tutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + id));
    }

    // Update
    public TutorEntity updateTutor(Long id, TutorEntity tutor) {
        TutorEntity existingTutor = findTutorById(id);
        // Update all fields
        existingTutor.setName(tutor.getName());
        existingTutor.setEmail(tutor.getEmail());
        existingTutor.setPassword(tutor.getPassword());
        existingTutor.setExpertiseSubjects(tutor.getExpertiseSubjects());
        existingTutor.setHourlyRate(tutor.getHourlyRate());
        existingTutor.setInstitution(tutor.getInstitution());
        existingTutor.setRating(tutor.getRating());
        existingTutor.setReviews(tutor.getReviews());
        existingTutor.setLocation(tutor.getLocation());
        existingTutor.setSchedule(tutor.getSchedule());
        existingTutor.setAvailability(tutor.getAvailability());
        existingTutor.setExperience(tutor.getExperience());
        return tutorRepository.save(existingTutor);
    }

    // Delete
    public void deleteTutor(Long id) {
        if (!tutorRepository.existsById(id)) {
            throw new RuntimeException("Tutor not found with id: " + id);
        }
        tutorRepository.deleteById(id);
    }

    // Check if exists
    public boolean existsById(Long id) {
        return tutorRepository.existsById(id);
    }
}
