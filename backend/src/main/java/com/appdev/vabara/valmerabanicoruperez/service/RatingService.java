package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.RatingEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    // Create
    public RatingEntity addRating(RatingEntity rating) {
        return ratingRepository.save(rating);
    }

    // Read - Get all
    public List<RatingEntity> getAllRatings() {
        return ratingRepository.findAll();
    }

    // Read - Get by ID
    public RatingEntity findRatingById(Long id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found with id: " + id));
    }

    // Update
    public RatingEntity updateRating(Long id, RatingEntity rating) {
        RatingEntity existingRating = findRatingById(id);
        existingRating.setStudentId(rating.getStudentId());
        existingRating.setTutorId(rating.getTutorId());
        existingRating.setSessionId(rating.getSessionId());
        existingRating.setRating(rating.getRating());
        existingRating.setComments(rating.getComments());
        return ratingRepository.save(existingRating);
    }

    // Delete
    public void deleteRating(Long id) {
        if (!ratingRepository.existsById(id)) {
            throw new RuntimeException("Rating not found with id: " + id);
        }
        ratingRepository.deleteById(id);
    }

    // Check if exists
    public boolean existsById(Long id) {
        return ratingRepository.existsById(id);
    }
}
