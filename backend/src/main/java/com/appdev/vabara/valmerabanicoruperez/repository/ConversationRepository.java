package com.appdev.vabara.valmerabanicoruperez.repository;

import com.appdev.vabara.valmerabanicoruperez.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByStudentEmailOrderByLastMessageAtDesc(String studentEmail);

    List<Conversation> findByTutorIdOrderByLastMessageAtDesc(Long tutorId);

    Optional<Conversation> findByStudentEmailAndTutorId(String studentEmail, Long tutorId);
}
