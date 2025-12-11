# Database-Connected Role-Based Authentication - Implementation Summary

## Problem Solved
Previously, when users registered as tutors, they would be logged in as students because the backend login was hardcoded to always return "student" as the userType. The system wasn't checking the database to determine the actual user role.

## Solution Implemented

### Backend Changes

#### 1. **Student Entity** (`Student.java`)
**Added Fields:**
- `email` (String) - for authentication
- `password` (String) - for authentication

**Why:** The Student entity was missing email and password fields, making it impossible to authenticate students properly.

#### 2. **StudentRepository** (`StudentRepository.java`)
**Added Method:**
```java
Optional<Student> findByEmail(String email);
```

**Why:** Needed to query students by email during login.

#### 3. **TutorRepository** (`TutorRepository.java`)
**Added Method:**
```java
Optional<TutorEntity> findByEmail(String email);
```

**Why:** Needed to query tutors by email during login.

#### 4. **StudentService** (`StudentService.java`)
**Added Method:**
```java
public StudentRepository getStudentRepository() {
    return studentRepository;
}
```

**Why:** AuthController needs access to the repository to query users by email.

#### 5. **TutorService** (`TutorService.java`)
**Added Method:**
```java
public TutorRepository getTutorRepository() {
    return tutorRepository;
}
```

**Why:** AuthController needs access to the repository to query users by email.

#### 6. **AuthController** (`AuthController.java`)
**Completely Rewrote Login Method:**

**Before:**
```java
String userType = "student"; // Hardcoded!
```

**After:**
```java
// Check if user is a student
Optional<Student> studentOpt = studentService.getStudentRepository().findByEmail(email);
if (studentOpt.isPresent()) {
    Student student = studentOpt.get();
    if (password.equals(student.getPassword())) {
        userType = "student";
        authenticated = true;
    }
}

// If not found as student, check if user is a tutor
if (!authenticated) {
    Optional<TutorEntity> tutorOpt = tutorService.getTutorRepository().findByEmail(email);
    if (tutorOpt.isPresent()) {
        TutorEntity tutor = tutorOpt.get();
        if (password.equals(tutor.getPassword())) {
            userType = "tutor";
            authenticated = true;
        }
    }
}
```

**What it does:**
1. Searches for the user in the Student table by email
2. If found, validates password and sets userType to "student"
3. If not found as student, searches in the Tutor table
4. If found as tutor, validates password and sets userType to "tutor"
5. Returns the correct userType in the response
6. Returns 401 error if credentials are invalid

### Frontend Changes

#### **RegisterPage.jsx**
**Updated Student Registration Body:**

**Before:**
```javascript
body = {
    name: `${formData.firstName} ${formData.lastName}`,
    age: 20
};
```

**After:**
```javascript
body = {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    password: formData.password,
    age: 20
};
```

**Why:** Student entity now requires email and password fields to be saved in the database.

## How It Works Now

### Registration Flow
1. **User selects role** (Student or Tutor) on registration page
2. **User fills in form** with name, email, password
3. **Frontend sends registration request** to:
   - Students: `/api/auth/register/student`
   - Tutors: `/api/auth/register/tutor`
4. **Backend saves user** in appropriate table (Student or Tutor)
5. **Frontend auto-logs in user** after successful registration
6. **User redirected to dashboard** with correct role

### Login Flow
1. **User enters email and password**
2. **Backend checks Student table** for matching email
   - If found and password matches → userType = "student"
3. **If not found, backend checks Tutor table**
   - If found and password matches → userType = "tutor"
4. **Backend returns userType** in response
5. **Frontend stores userType** in localStorage
6. **Navigation renders** based on userType

### Navigation Display
- **Students see:** Dashboard, Sessions, Find Tutors, Messages, Settings
- **Tutors see:** Dashboard, Sessions, Messages, Settings (no Find Tutors)

## Database Schema Updates

### Student Table
```sql
CREATE TABLE student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),      -- NEW
    password VARCHAR(255),   -- NEW
    age INT
);
```

### Tutor Table
```sql
CREATE TABLE tutors (
    tutor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    expertise_subjects VARCHAR(255),
    hourly_rate DOUBLE,
    institution VARCHAR(255),
    rating INT,
    reviews INT,
    location VARCHAR(255),
    schedule VARCHAR(255),
    availability VARCHAR(255),
    experience INT
);
```

## Security Notes

⚠️ **Important:** The current implementation uses plain text password comparison:
```java
if (password.equals(student.getPassword()))
```

**For Production:**
- Use BCrypt or similar password hashing
- Never store passwords in plain text
- Add password strength validation
- Implement rate limiting on login attempts
- Add CSRF protection
- Enable HTTPS (set `secure: true` on cookies)

## Testing

### Test Student Registration & Login
1. Register as a student with email `student@test.com`
2. Verify user is saved in Student table
3. Log out
4. Log in with `student@test.com`
5. Verify userType = "student" in localStorage
6. Verify "Find Tutors" appears in navigation

### Test Tutor Registration & Login
1. Register as a tutor with email `tutor@test.com`
2. Verify user is saved in Tutor table
3. Log out
4. Log in with `tutor@test.com`
5. Verify userType = "tutor" in localStorage
6. Verify "Find Tutors" does NOT appear in navigation
7. Try accessing `/find-tutors` directly → should redirect to dashboard

## Files Modified

### Backend
1. `Student.java` - Added email and password fields
2. `StudentRepository.java` - Added findByEmail method
3. `TutorRepository.java` - Added findByEmail method
4. `StudentService.java` - Added repository getter
5. `TutorService.java` - Added repository getter
6. `AuthController.java` - Implemented database authentication

### Frontend
1. `RegisterPage.jsx` - Added email/password to student registration
2. `LoginPage.jsx` - Already updated in previous changes
3. `ProtectedRoute.jsx` - Already updated in previous changes
4. `Layout.jsx` - Already updated in previous changes
5. `Header.jsx` - Already updated in previous changes
6. `App.js` - Already updated in previous changes

## Branch
**Branch Name:** `feature/role-based-navigation`

## Next Steps
1. Test registration and login for both roles
2. Verify database entries are created correctly
3. Test navigation differences between roles
4. Consider adding password hashing (BCrypt)
5. Add email validation
6. Add password strength requirements
