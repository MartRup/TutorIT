package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.Rating;
import com.appdev.vabara.valmerabanicoruperez.repository.RatingRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    public Rating getRatingById(Long id) {
        return ratingRepository.findById(id).orElse(null);
    }

    public Rating saveRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public Rating updateRating(Long id, Rating updatedRating) {
        Rating existingRating = getRatingById(id);
        if (existingRating != null) {
            existingRating.setStudentId(updatedRating.getStudentId());
            existingRating.setTutorId(updatedRating.getTutorId());
            existingRating.setSessionId(updatedRating.getSessionId());
            existingRating.setRating(updatedRating.getRating());
            existingRating.setComments(updatedRating.getComments());
            return ratingRepository.save(existingRating);
        }
        return null;
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}
