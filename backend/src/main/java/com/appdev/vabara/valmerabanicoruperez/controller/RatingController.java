package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.Rating;
import com.appdev.vabara.valmerabanicoruperez.entity.RatingEntity;
import com.appdev.vabara.valmerabanicoruperez.service.RatingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping
    public List<RatingEntity> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @GetMapping("/{id}")
    public Rating getRatingById(@PathVariable int id) {
        return ratingService.getRatingById(id);
    }

    @PostMapping
    public RatingEntity createRating(@RequestBody Rating rating) {
        return ratingService.saveRating(rating);
    }

    @PutMapping("/{id}")
    public RatingEntity updateRating(@PathVariable int id, @RequestBody RatingEntity updatedRating) {
        return ratingService.updateRating(id, updatedRating);
    }

    @DeleteMapping("/{id}")
    public void deleteRating(@PathVariable int id) {
        ratingService.deleteRating(id);
    }
}
