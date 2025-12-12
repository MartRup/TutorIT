package com.appdev.vabara.valmerabanicoruperez.dto;

public class TutorStatsDTO {
    private int totalSessions;
    private int totalStudents;
    private double totalEarnings;
    private double averageRating;

    public TutorStatsDTO() {
    }

    public TutorStatsDTO(int totalSessions, int totalStudents, double totalEarnings, double averageRating) {
        this.totalSessions = totalSessions;
        this.totalStudents = totalStudents;
        this.totalEarnings = totalEarnings;
        this.averageRating = averageRating;
    }

    public int getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(int totalSessions) {
        this.totalSessions = totalSessions;
    }

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}
