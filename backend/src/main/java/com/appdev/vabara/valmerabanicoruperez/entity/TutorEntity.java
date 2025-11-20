package com.appdev.vabara.valmerabanicoruperez.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tutors")
public class TutorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tutorId;

    private String name;
    private String email;
    private String password;
    private String expertiseSubjects;
    private Double hourlyRate;

    public Long getTutorId() {
        return tutorId;
    }

    public void setTutorId(Long tutorId) {
        this.tutorId = tutorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getExpertiseSubjects() {
        return expertiseSubjects;
    }

    public void setExpertiseSubjects(String expertiseSubjects) {
        this.expertiseSubjects = expertiseSubjects;
    }

    public Double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
}
