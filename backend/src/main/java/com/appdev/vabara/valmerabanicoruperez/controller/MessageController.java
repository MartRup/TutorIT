package com.appdev.vabara.valmerabanicoruperez.controller;

import com.appdev.vabara.valmerabanicoruperez.entity.Conversation;
import com.appdev.vabara.valmerabanicoruperez.entity.Message;
import com.appdev.vabara.valmerabanicoruperez.entity.TutorEntity;
import com.appdev.vabara.valmerabanicoruperez.repository.ConversationRepository;
import com.appdev.vabara.valmerabanicoruperez.repository.MessageRepository;
import com.appdev.vabara.valmerabanicoruperez.repository.TutorRepository;
import com.appdev.vabara.valmerabanicoruperez.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MessageController {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final TutorRepository tutorRepository;
    private final JwtUtil jwtUtil;

    public MessageController(MessageRepository messageRepository,
            ConversationRepository conversationRepository,
            TutorRepository tutorRepository,
            JwtUtil jwtUtil) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.tutorRepository = tutorRepository;
        this.jwtUtil = jwtUtil;
    }

    // Get current user from JWT
    private Map<String, String> getCurrentUser(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    try {
                        String email = jwtUtil.extractEmail(cookie.getValue());
                        String userType = jwtUtil.extractUserType(cookie.getValue());
                        Map<String, String> user = new HashMap<>();
                        user.put("email", email);
                        user.put("userType", userType);
                        return user;
                    } catch (Exception e) {
                        return null;
                    }
                }
            }
        }
        return null;
    }

    // Create a new conversation
    @PostMapping("/conversations")
    public ResponseEntity<Map<String, Object>> createConversation(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, String> currentUser = getCurrentUser(httpRequest);
            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }

            String studentEmail = currentUser.get("email");
            Long tutorId = Long.valueOf(request.get("tutorId").toString());
            String tutorName = (String) request.get("tutorName");
            String tutorSubject = (String) request.get("tutorSubject");

            // Check if conversation already exists
            Optional<Conversation> existing = conversationRepository.findByStudentEmailAndTutorId(studentEmail,
                    tutorId);
            if (existing.isPresent()) {
                response.put("success", true);
                response.put("data", convertConversationToMap(existing.get()));
                response.put("message", "Conversation already exists");
                return ResponseEntity.ok(response);
            }

            // Create new conversation
            Conversation conversation = new Conversation(studentEmail, tutorId, tutorName, tutorSubject);
            conversation = conversationRepository.save(conversation);

            response.put("success", true);
            response.put("data", convertConversationToMap(conversation));
            response.put("message", "Conversation created successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating conversation: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get all conversations for current user
    @GetMapping("/conversations")
    public ResponseEntity<Map<String, Object>> getConversations(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, String> currentUser = getCurrentUser(request);
            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }

            String email = currentUser.get("email");
            String userType = currentUser.get("userType");

            List<Conversation> conversations;
            if ("student".equals(userType)) {
                conversations = conversationRepository.findByStudentEmailOrderByLastMessageAtDesc(email);
            } else {
                // For tutors, find their tutor ID first
                Optional<TutorEntity> tutorOpt = tutorRepository.findByEmail(email);
                if (tutorOpt.isEmpty()) {
                    response.put("success", true);
                    response.put("data", new ArrayList<>());
                    return ResponseEntity.ok(response);
                }
                conversations = conversationRepository
                        .findByTutorIdOrderByLastMessageAtDesc(tutorOpt.get().getTutorId());
            }

            List<Map<String, Object>> conversationMaps = new ArrayList<>();
            for (Conversation conv : conversations) {
                conversationMaps.add(convertConversationToMap(conv));
            }

            response.put("success", true);
            response.put("data", conversationMaps);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching conversations: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get messages for a conversation
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Map<String, Object>> getMessages(
            @PathVariable Long conversationId,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, String> currentUser = getCurrentUser(request);
            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }

            List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

            List<Map<String, Object>> messageMaps = new ArrayList<>();
            String currentUserEmail = currentUser.get("email");

            for (Message msg : messages) {
                messageMaps.add(convertMessageToMap(msg, currentUserEmail));
            }

            response.put("success", true);
            response.put("data", messageMaps);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching messages: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Send a message
    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, String> currentUser = getCurrentUser(httpRequest);
            if (currentUser == null) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }

            String messageText = request.get("messageText");
            if (messageText == null || messageText.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Message text is required");
                return ResponseEntity.status(400).body(response);
            }

            String senderEmail = currentUser.get("email");
            String senderType = currentUser.get("userType");

            // Create and save message
            Message message = new Message(conversationId, senderEmail, senderType, messageText);
            message = messageRepository.save(message);

            // Update conversation's last message
            Optional<Conversation> convOpt = conversationRepository.findById(conversationId);
            if (convOpt.isPresent()) {
                Conversation conv = convOpt.get();
                conv.setLastMessageText(messageText.length() > 50 ? messageText.substring(0, 50) + "..." : messageText);
                conv.setLastMessageAt(LocalDateTime.now());
                conversationRepository.save(conv);
            }

            response.put("success", true);
            response.put("data", convertMessageToMap(message, senderEmail));
            response.put("message", "Message sent successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error sending message: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Helper methods
    private Map<String, Object> convertConversationToMap(Conversation conv) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", conv.getId());
        map.put("tutorId", conv.getTutorId());
        map.put("name", conv.getTutorName());
        map.put("role", conv.getTutorSubject() != null ? conv.getTutorSubject() : "Tutor");
        map.put("status", "Online now");
        map.put("lastMessage",
                conv.getLastMessageText() != null ? conv.getLastMessageText() : "Start a conversation...");
        map.put("time", formatTime(conv.getLastMessageAt()));
        map.put("unread", 0);
        return map;
    }

    private Map<String, Object> convertMessageToMap(Message msg, String currentUserEmail) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", msg.getId());
        map.put("sender", msg.getSenderEmail());
        map.put("text", msg.getMessageText());
        map.put("time", formatTime(msg.getCreatedAt()));
        map.put("isMe", msg.getSenderEmail().equals(currentUserEmail));
        map.put("userType", msg.getSenderType());
        return map;
    }

    private String formatTime(LocalDateTime dateTime) {
        if (dateTime == null)
            return "Just now";

        LocalDateTime now = LocalDateTime.now();
        long hoursDiff = java.time.Duration.between(dateTime, now).toHours();

        if (hoursDiff < 1) {
            return "Just now";
        } else if (hoursDiff < 24) {
            return dateTime.format(DateTimeFormatter.ofPattern("h:mm a"));
        } else if (hoursDiff < 48) {
            return "Yesterday";
        } else {
            return dateTime.format(DateTimeFormatter.ofPattern("MMM d"));
        }
    }
}
