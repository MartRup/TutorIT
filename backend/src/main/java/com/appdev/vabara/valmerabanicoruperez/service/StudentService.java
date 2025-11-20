package com.appdev.vabara.valmerabanicoruperez.service;

import com.appdev.vabara.valmerabanicoruperez.entity.Student;
import com.appdev.vabara.valmerabanicoruperez.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student findStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student updateStudent(Long id, Student student) {
        Student existingStudent = findStudentById(id);
        existingStudent.setName(student.getName());
        existingStudent.setAge(student.getAge());
        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public List<Student> findAllStudents() {
        return studentRepository.findAll();
    }
}
