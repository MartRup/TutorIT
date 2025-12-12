package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.TutoringSessionEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.TutoringSessionRepository;
import com.appdev.vabara.valmerabanicoruperez.repository.StudentRepository;
import com.appdev.vabara.valmerabanicoruperez.repository.TutorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TutoringSessionService {

    private final TutoringSessionRepository tutoringSessionRepository;
    private final StudentRepository studentRepository;
    private final TutorRepository tutorRepository;

    public TutoringSessionService(TutoringSessionRepository tutoringSessionRepository,
            StudentRepository studentRepository,
            TutorRepository tutorRepository) {
        this.tutoringSessionRepository = tutoringSessionRepository;
        this.studentRepository = studentRepository;
        this.tutorRepository = tutorRepository;
    }

    // Create
    public TutoringSessionEntity addTutoringSession(TutoringSessionEntity tutoringSession) {
        // Generate UUID if not set
        if (tutoringSession.getSessionId() == null || tutoringSession.getSessionId().isEmpty()) {
            tutoringSession.setSessionId(UUID.randomUUID().toString());
        }
        // Set default payment ID if not provided
        if (tutoringSession.getPaymentId() == null || tutoringSession.getPaymentId().isEmpty()) {
            tutoringSession.setPaymentId("PAYMENT-" + UUID.randomUUID().toString());
        }
        // Set default subject ID if not provided
        if (tutoringSession.getSubjectId() == null || tutoringSession.getSubjectId().isEmpty()) {
            tutoringSession.setSubjectId("SUBJECT-001");
        }

        // Populate student name if studentId is provided
        if (tutoringSession.getStudentId() != null && !tutoringSession.getStudentId().isEmpty()) {
            try {
                Long studentId = Long.parseLong(tutoringSession.getStudentId());
                studentRepository.findById(studentId)
                        .ifPresent(student -> tutoringSession.setStudentName(student.getName()));
            } catch (NumberFormatException e) {
                // If studentId is not a valid number, skip
            }
        }

        // Populate tutor name if tutorId is provided
        if (tutoringSession.getTutorId() != null && !tutoringSession.getTutorId().isEmpty()) {
            try {
                Long tutorId = Long.parseLong(tutoringSession.getTutorId());
                tutorRepository.findById(tutorId).ifPresent(tutor -> tutoringSession.setTutorName(tutor.getName()));
            } catch (NumberFormatException e) {
                // If tutorId is not a valid number, skip
            }
        }

        return tutoringSessionRepository.save(tutoringSession);
    }

    // Read - Get by ID
    public TutoringSessionEntity findTutoringSessionById(String id) {
        TutoringSessionEntity session = tutoringSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutoring session not found with id: " + id));

        // Populate names if not already set
        populateNames(session);
        return session;
    }

    // Read - Get all
    public List<TutoringSessionEntity> findAllTutoringSessions() {
        List<TutoringSessionEntity> sessions = tutoringSessionRepository.findAll();
        // Populate names for all sessions
        sessions.forEach(this::populateNames);
        return sessions;
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
        existingTutoringSession.setRating(tutoringSession.getRating());
        existingTutoringSession.setFeedback(tutoringSession.getFeedback());
        existingTutoringSession.setTutorName(tutoringSession.getTutorName());
        existingTutoringSession.setStudentName(tutoringSession.getStudentName());
        existingTutoringSession.setSubject(tutoringSession.getSubject());
        existingTutoringSession.setTopic(tutoringSession.getTopic());

        // Populate names if they weren't provided in the update
        populateNames(existingTutoringSession);

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

    // Helper method to populate student and tutor names
    private void populateNames(TutoringSessionEntity session) {
        // Populate student name if not already set
        if ((session.getStudentName() == null || session.getStudentName().isEmpty())
                && session.getStudentId() != null && !session.getStudentId().isEmpty()) {
            try {
                Long studentId = Long.parseLong(session.getStudentId());
                studentRepository.findById(studentId).ifPresent(student -> session.setStudentName(student.getName()));
            } catch (NumberFormatException e) {
                // If studentId is not a valid number, skip
            }
        }

        // Populate tutor name if not already set
        if ((session.getTutorName() == null || session.getTutorName().isEmpty())
                && session.getTutorId() != null && !session.getTutorId().isEmpty()) {
            try {
                Long tutorId = Long.parseLong(session.getTutorId());
                tutorRepository.findById(tutorId).ifPresent(tutor -> session.setTutorName(tutor.getName()));
            } catch (NumberFormatException e) {
                // If tutorId is not a valid number, skip
            }
        }
    }

    // Get tutor statistics
    public com.appdev.vabara.valmerabanicoruperez.dto.TutorStatsDTO getTutorStats(String tutorId) {
        List<TutoringSessionEntity> tutorSessions = tutoringSessionRepository.findAll().stream()
                .filter(session -> tutorId.equals(session.getTutorId()))
                .toList();

        int totalSessions = tutorSessions.size();

        // Count unique students
        int totalStudents = (int) tutorSessions.stream()
                .map(TutoringSessionEntity::getStudentId)
                .filter(studentId -> studentId != null && !studentId.isEmpty())
                .distinct()
                .count();

        // Calculate total earnings
        double totalEarnings = tutorSessions.stream()
                .filter(session -> session.getPrice() != null)
                .mapToDouble(TutoringSessionEntity::getPrice)
                .sum();

        // Calculate average rating from completed sessions with ratings
        double averageRating = tutorSessions.stream()
                .filter(session -> session.getRating() != null && session.getRating() > 0)
                .mapToInt(TutoringSessionEntity::getRating)
                .average()
                .orElse(0.0);

        return new com.appdev.vabara.valmerabanicoruperez.dto.TutorStatsDTO(
                totalSessions, totalStudents, totalEarnings, averageRating);
    }
}