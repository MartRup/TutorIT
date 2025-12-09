package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.TutoringSessionEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.TutoringSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutoringSessionService {

    private final TutoringSessionRepository tutoringSessionRepository;

    public TutoringSessionService(TutoringSessionRepository tutoringSessionRepository) {
        this.tutoringSessionRepository = tutoringSessionRepository;
    }

    // Create
    public TutoringSessionEntity addTutoringSession(TutoringSessionEntity tutoringSession) {
        return tutoringSessionRepository.save(tutoringSession);
    }

    // Read - Get by ID
    public TutoringSessionEntity findTutoringSessionById(String id) {
        return tutoringSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutoring session not found with id: " + id));
    }

    // Read - Get all
    public List<TutoringSessionEntity> findAllTutoringSessions() {
        return tutoringSessionRepository.findAll();
    }

    // Update
    public TutoringSessionEntity updateTutoringSession(String id, TutoringSessionEntity tutoringSession) {
        TutoringSessionEntity existingTutoringSession = findTutoringSessionById(id);
        existingTutoringSession.setDateTime(tutoringSession.getDateTime());
        existingTutoringSession.setDuration(tutoringSession.getDuration());
        existingTutoringSession.setStatus(tutoringSession.getStatus());
        existingTutoringSession.setStudentId(tutoringSession.getStudentId());
        existingTutoringSession.setTutorId(tutoringSession.getTutorId());
        existingTutoringSession.setSubjectId(tutoringSession.getSubjectId());
        existingTutoringSession.setPaymentId(tutoringSession.getPaymentId());
        return tutoringSessionRepository.save(existingTutoringSession);
    }

    // Delete
    public void deleteTutoringSession(String id) {
        if (!tutoringSessionRepository.existsById(id)) {
            throw new RuntimeException("Tutoring session not found with id: " + id);
        }
        tutoringSessionRepository.deleteById(id);
    }

    // Check if exists
    public boolean existsById(String id) {
        return tutoringSessionRepository.existsById(id);
    }
}