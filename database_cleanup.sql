-- TutorIT Database Cleanup Script
-- Run this to fix duplicate email issues

USE tutorit;

-- ============================================
-- STEP 1: Check current data
-- ============================================
SELECT 'Current Student Data:' as Info;
SELECT id, name, email FROM student;

SELECT 'Current Tutor Data:' as Info;
SELECT tutor_id, name, email FROM tutors;

-- ============================================
-- STEP 2: Clean up Student table
-- ============================================

-- Option A: Delete ALL students and start fresh (RECOMMENDED for testing)
TRUNCATE TABLE student;

-- Option B: Keep students but fix emails (if you want to preserve data)
-- Uncomment these lines if you want to keep existing students:
/*
-- Update NULL or empty emails with unique values
UPDATE student 
SET email = CONCAT('student', id, '@example.com')
WHERE email IS NULL OR email = '';

-- Delete duplicate emails, keeping only the first occurrence
DELETE s1 FROM student s1
INNER JOIN student s2 
WHERE s1.id > s2.id AND s1.email = s2.email;
*/

-- ============================================
-- STEP 3: Clean up Tutors table
-- ============================================

-- Option A: Delete ALL tutors and start fresh (RECOMMENDED for testing)
TRUNCATE TABLE tutors;

-- Option B: Keep tutors but fix emails (if you want to preserve data)
-- Uncomment these lines if you want to keep existing tutors:
/*
-- Update NULL or empty emails with unique values
UPDATE tutors 
SET email = CONCAT('tutor', tutor_id, '@example.com')
WHERE email IS NULL OR email = '';

-- Delete duplicate emails, keeping only the first occurrence
DELETE t1 FROM tutors t1
INNER JOIN tutors t2 
WHERE t1.tutor_id > t2.tutor_id AND t1.email = t2.email;
*/

-- ============================================
-- STEP 4: Verify cleanup
-- ============================================
SELECT 'After Cleanup - Student Data:' as Info;
SELECT id, name, email FROM student;

SELECT 'After Cleanup - Tutor Data:' as Info;
SELECT tutor_id, name, email FROM tutors;

-- ============================================
-- STEP 5: Add unique constraints (if not already added by Hibernate)
-- ============================================
-- These will be added automatically when you restart the backend
-- But you can add them manually if needed:
/*
ALTER TABLE student 
ADD UNIQUE INDEX idx_student_email (email);

ALTER TABLE tutors 
ADD UNIQUE INDEX idx_tutor_email (email);
*/

SELECT 'Database cleanup complete!' as Status;
SELECT 'Please restart the backend server now.' as NextStep;
