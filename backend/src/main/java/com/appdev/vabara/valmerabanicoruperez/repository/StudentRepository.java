package com.appdev.vabara.valmerabanicoruperez.repository;

import com.appdev.vabara.valmerabanicoruperez.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
