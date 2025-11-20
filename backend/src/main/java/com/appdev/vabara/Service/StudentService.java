package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.Student;
import com.appdev.vabara.valmerabanicoruperez.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(Long studentId) {
        return studentRepository.findById(studentId);
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        studentRepository.deleteById(studentId);
    }

    public boolean existsById(Long studentId) {
        return studentRepository.existsById(studentId);
    }
}
