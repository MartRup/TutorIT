package com.appdev.vabara.valmerabanicoruperez.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "tutoring_session")
public class TutoringSessionEntity {

    @Id
    @Column(name = "session_id", nullable = false, length = 36)
    private String sessionId;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "tutor_id", nullable = false)
    private String tutorId;

    @Column(name = "subject_id", nullable = false)
    private String subjectId;

    @Column(name = "payment_id", nullable = false)
    private String paymentId;

    public TutoringSessionEntity() {
    }

    public TutoringSessionEntity(String sessionId, LocalDateTime dateTime, Integer duration, String status,
            String studentId, String tutorId, String subjectId, String paymentId) {
        this.sessionId = sessionId;
        this.dateTime = dateTime;
        this.duration = duration;
        this.status = status;
        this.studentId = studentId;
        this.tutorId = tutorId;
        this.subjectId = subjectId;
        this.paymentId = paymentId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getTutorId() {
        return tutorId;
    }

    public void setTutorId(String tutorId) {
        this.tutorId = tutorId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
}
