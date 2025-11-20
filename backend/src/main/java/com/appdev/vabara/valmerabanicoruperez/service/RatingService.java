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

    public List<RatingEntity> getAllRatings() {
        return ratingRepository.findAll();
    }

    public RatingEntity getRatingById(Long id) {
        return ratingRepository.findById(id).orElse(null);
    }

    public RatingEntity saveRating(RatingEntity rating) {
        return ratingRepository.save(rating);
    }

    public RatingEntity updateRating(Long id, RatingEntity updatedRating) {
        RatingEntity existingRating = getRatingById(id);
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
