# Registration Form Update - Role-Based Fields

## Changes Made

Updated the RegisterPage to show different fields based on whether the user is registering as a **Student** or **Tutor**.

## Form Fields

### For Students:
1. ✅ First Name
2. ✅ Last Name
3. ✅ Email Address
4. ✅ Password (masked with •••)
5. ✅ Confirm Password (masked with •••)

### For Tutors:
1. ✅ First Name
2. ✅ Last Name
3. ✅ Email Address
4. ✅ **Institution** (NEW - only shows for tutors)
5. ✅ Password (masked with •••)
6. ✅ Confirm Password (masked with •••)

## Features

### Password Masking
- Both password fields use `type="password"` attribute
- Passwords are displayed as dots (•••) for security
- Users cannot see what they're typing

### Dynamic Form
- Institution field only appears when "Tutor" is selected
- Field is required for tutors
- Placeholder text: "e.g., University of the Philippines"

### Data Sent to Backend

**Student Registration:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 20
}
```

**Tutor Registration:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "institution": "University of the Philippines",
  "expertiseSubjects": "",
  "hourlyRate": 0.0
}
```

## User Experience

1. **User selects role** (Student or Tutor)
2. **Form adapts** - Institution field appears/disappears
3. **User fills form** with appropriate fields
4. **Passwords are masked** for security
5. **Submit** - Data sent to appropriate endpoint
6. **Auto-login** - User is logged in and redirected to dashboard

## Validation

- All fields are required
- Email must be valid format
- Password and Confirm Password must match
- Institution is required for tutors (optional for students)

## Security

✅ Passwords are masked with type="password"
✅ Passwords are not visible in the UI
✅ Password confirmation prevents typos
✅ Unique email constraint prevents duplicates

## Testing

### Test Student Registration:
1. Go to /register
2. Select "Student"
3. Fill: First Name, Last Name, Email, Password, Confirm Password
4. Notice: No institution field
5. Submit and verify auto-login

### Test Tutor Registration:
1. Go to /register
2. Select "Tutor"
3. Notice: Institution field appears
4. Fill: First Name, Last Name, Email, Institution, Password, Confirm Password
5. Submit and verify auto-login
6. Check database: institution field should be populated

## Files Modified

- `RegisterPage.jsx` - Added institution field and conditional rendering
