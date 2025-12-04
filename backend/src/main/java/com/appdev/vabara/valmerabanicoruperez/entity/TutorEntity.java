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
    private String institution;
    private Integer rating;
    private Integer reviews;
    private String location;
    private String schedule;
    private String availability;
    private Integer experience;

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

    // Additional fields
    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getReviews() {
        return reviews;
    }

    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }
}
