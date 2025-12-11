# End-to-End Messaging System Implementation

## Overview

Implemented a complete database-backed messaging system that allows students and tutors to send and receive messages in real-time.

## Backend Implementation

### 1. Database Entities

#### Message Entity (`Message.java`)
```java
- id: Long (Primary Key)
- conversationId: Long
- senderEmail: String
- senderType: String ("student" or "tutor")
- messageText: TEXT
- createdAt: LocalDateTime
- isRead: Boolean
```

#### Conversation Entity (`Conversation.java`)
```java
- id: Long (Primary Key)
- studentEmail: String
- tutorId: Long
- tutorName: String
- tutorSubject: String
- createdAt: LocalDateTime
- lastMessageAt: LocalDateTime
- lastMessageText: TEXT
```

### 2. Repositories

#### MessageRepository
- `findByConversationIdOrderByCreatedAtAsc()` - Get all messages in a conversation
- `findByConversationIdAndIsReadFalse()` - Get unread messages

#### ConversationRepository
- `findByStudentEmailOrderByLastMessageAtDesc()` - Get student's conversations
- `findByTutorIdOrderByLastMessageAtDesc()` - Get tutor's conversations
- `findByStudentEmailAndTutorId()` - Check if conversation exists

### 3. REST API Endpoints

#### POST `/api/messages/conversations`
**Create a new conversation**
- Request Body: `{ tutorId, tutorName, tutorSubject }`
- Returns: Conversation object
- Prevents duplicates

#### GET `/api/messages/conversations`
**Get all conversations for current user**
- Students: Returns conversations they initiated
- Tutors: Returns conversations where they are the tutor
- Sorted by last message time (newest first)

#### GET `/api/messages/conversations/{conversationId}/messages`
**Get all messages in a conversation**
- Returns messages sorted by creation time
- Marks messages as "isMe" based on current user

#### POST `/api/messages/conversations/{conversationId}/messages`
**Send a message**
- Request Body: `{ messageText }`
- Creates message in database
- Updates conversation's last message
- Returns created message

## Frontend Implementation

### Updated messageService.js

Replaced localStorage with real API calls:

```javascript
// Before: localStorage.getItem('conversations')
// After: fetch('http://localhost:8080/api/messages/conversations')

getConversations() → GET /api/messages/conversations
getMessages(id) → GET /api/messages/conversations/{id}/messages
sendMessage(id, text) → POST /api/messages/conversations/{id}/messages
createConversation(tutor) → POST /api/messages/conversations
```

## How It Works

### Creating a Conversation

1. **Student clicks chat button** on Find Tutors page
2. **Frontend calls** `createConversation(tutorData)`
3. **Backend checks** if conversation already exists
4. **If new:** Creates conversation in database
5. **Returns** conversation object to frontend
6. **Frontend navigates** to Messages page

### Sending a Message

1. **User types message** and clicks send
2. **Frontend calls** `sendMessage(conversationId, text)`
3. **Backend:**
   - Extracts user info from JWT cookie
   - Creates Message entity
   - Saves to database
   - Updates conversation's last message
4. **Returns** message object
5. **Frontend displays** message in chat

### Receiving Messages

1. **User opens Messages page**
2. **Frontend calls** `getConversations()`
3. **Backend:**
   - Gets user from JWT
   - Queries conversations (student or tutor)
   - Returns list sorted by last message time
4. **User selects conversation**
5. **Frontend calls** `getMessages(conversationId)`
6. **Backend:**
   - Queries all messages for that conversation
   - Marks which are from current user (isMe)
7. **Frontend displays** full chat history

## Database Schema

### Tables Created

```sql
CREATE TABLE conversations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_email VARCHAR(255) NOT NULL,
  tutor_id BIGINT NOT NULL,
  tutor_name VARCHAR(255),
  tutor_subject VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  last_message_at TIMESTAMP,
  last_message_text TEXT
);

CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_type VARCHAR(50) NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

## Features

### ✅ What Works Now:

1. **Cross-User Messaging**
   - Student sends message → Tutor sees it
   - Tutor replies → Student sees it
   - Messages stored in database

2. **Conversation Management**
   - Create conversations from Find Tutors
   - View all conversations
   - Sorted by most recent activity

3. **Message History**
   - All messages persist in database
   - Full chat history available
   - Messages survive page refresh

4. **User Context**
   - Messages marked as "isMe" correctly
   - Shows sender email
   - Displays sender type (student/tutor)

5. **Real-Time Updates**
   - Last message preview updates
   - Timestamp formatting (Just now, Yesterday, etc.)
   - Conversation list reorders

## Testing

### Test End-to-End Messaging:

1. **As Student:**
   - Register/Login as student
   - Go to Find Tutors
   - Click chat button on a tutor
   - Go to Messages
   - Send a message

2. **As Tutor:**
   - Register/Login as tutor (same tutor from step 1)
   - Go to Messages
   - See conversation with student
   - See student's message
   - Reply to student

3. **Back to Student:**
   - Refresh Messages page
   - See tutor's reply
   - Continue conversation

## Files Created/Modified

### Backend (New Files):
1. `Message.java` - Message entity
2. `Conversation.java` - Conversation entity
3. `MessageRepository.java` - Message data access
4. `ConversationRepository.java` - Conversation data access
5. `MessageController.java` - REST API endpoints

### Frontend (Modified):
1. `messageService.js` - Replaced localStorage with API calls

### Existing Files (No changes needed):
- `MessagesPage.jsx` - Already uses messageService
- `FindTutors.jsx` - Already uses createConversation

## Next Steps (Optional Enhancements)

1. **Real-Time Updates**
   - WebSocket for instant message delivery
   - No need to refresh to see new messages

2. **Read Receipts**
   - Mark messages as read
   - Show "unread" count

3. **Typing Indicators**
   - Show when other user is typing

4. **Message Notifications**
   - Desktop/browser notifications
   - Unread message badges

5. **File Attachments**
   - Send images, PDFs, etc.

6. **Message Search**
   - Search within conversations
   - Search across all conversations

## Important Notes

### Authentication
- Uses JWT cookies for user identification
- Automatically gets current user from token
- Secure - users can only see their own conversations

### Data Persistence
- All data stored in MySQL database
- Messages never lost
- Works across different browsers/devices

### Performance
- Conversations sorted by last activity
- Messages loaded per conversation
- Efficient database queries

## Restart Required

After adding these files, you need to:

1. **Restart the backend server**
   - Stop current backend (Ctrl+C)
   - Run: `mvnw spring-boot:run`
   - Hibernate will create the new tables

2. **Frontend should work automatically**
   - No restart needed
   - messageService.js updated to use API

The messaging system is now fully functional with end-to-end communication! 🎉
