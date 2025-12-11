# Database Cleanup Guide - Fix Duplicate Email Error

## Problem
Error: "Query did not return a unique result: 5 results were returned"

This happens because there are 5 student records with the same email address in the database.

## Quick Fix (Recommended for Testing)

### Step 1: Open MySQL Command Line or MySQL Workbench

### Step 2: Run these commands:

```sql
USE tutorit;

-- Delete all existing students
TRUNCATE TABLE student;

-- Delete all existing tutors
TRUNCATE TABLE tutors;
```

### Step 3: Restart the Backend Server

1. Stop the backend (press Ctrl+C in the terminal running the backend)
2. Start it again:
   ```bash
   cd backend
   mvnw spring-boot:run
   ```
3. Wait for "Started ValmerabanicoruperezApplication"

### Step 4: Test Registration

1. Go to http://localhost:3000/register
2. Select "Student"
3. Fill in the form with a NEW email (e.g., `student1@test.com`)
4. Register
5. You should be automatically logged in and redirected to dashboard

### Step 5: Test Login

1. Log out
2. Go to http://localhost:3000/login
3. Enter the email and password you just registered with
4. Login should work!

## Alternative: Keep Existing Data

If you want to keep your existing data, use the `database_cleanup.sql` file:

1. Open MySQL Workbench or MySQL Command Line
2. Run the script: `database_cleanup.sql`
3. It will fix duplicate emails by giving each record a unique email
4. Restart the backend

## Why This Happened

When we added the `email` field to the Student entity:
- Existing students in the database had NULL emails
- When you registered new students, they all got the same email or NULL
- The `findByEmail()` query found multiple records instead of one

## Prevention

After cleanup, the unique constraint on email will prevent this from happening again:
- Each email can only be used once
- Registration will fail if you try to use an existing email
- Login will always find exactly one user (or none)

## Verification

After cleanup, verify with:

```sql
USE tutorit;

-- Should show unique emails only
SELECT id, name, email FROM student;

-- Should show unique emails only
SELECT tutor_id, name, email FROM tutors;
```
