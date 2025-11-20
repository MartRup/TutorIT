package com.appdev.vabara.valmerabanicoruperez.repository;

import com.appdev.vabara.valmerabanicoruperez.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
}
