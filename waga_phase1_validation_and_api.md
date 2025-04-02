## Data Validation Rules

For Phase 1, implement the following validation rules:

1. **User Email**:
   - Must be unique in the system
   - Must be a valid email format
   - Maximum length: 255 characters

2. **Passwords**:
   - Minimum 8 characters
   - Must include at least one uppercase letter, one lowercase letter, one number, and one special character
   - Should not contain common patterns or dictionary words

3. **Required Fields**:
   - Ensure all required fields have values and appropriate types
   - Validate that string fields are not empty when required
   - Ensure numeric fields have appropriate values

4. **Enumerated Values**:
   - Validate that enum values match defined options
   - Reject requests with invalid enum values

5. **Dates**:
   - Ensure end dates are after start dates
   - Validate that dates are in the correct format
   - For events and courses, start dates should not be in the past when creating

6. **Relationships**:
   - Validate that referenced entities exist
   - Check permissions for relationship creation (e.g., only admins can assign instructors)

7. **String Lengths**:
   - Enforce minimum and maximum lengths for text fields:
     - Names: 2-100 characters
     - Titles: 3-200 characters
     - Descriptions: 10-5000 characters
     - URLs: Maximum 2083 characters

8. **Numeric Ranges**:
   - Validate numeric values are within acceptable ranges:
     - Ratings: 1-5
     - Progress: 0-100
     - Prices: Non-negative
     - Capacities: Positive integers

9. **File Uploads**:
   - Validate file types against allowed MIME types
   - Enforce maximum file size limits
   - Scan for malware/viruses

10. **Unique Constraints**:
    - Enforce uniqueness for slugs, usernames, and other identifiers
    - Prevent duplicate enrollments, registrations, etc.

11. **Waitlist Validation**:
    - Ensure a user can only join a waitlist once per course
    - Validate that waitlist is enabled for the course
    - Check that course has reached maximum enrollment before allowing waitlist entries

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `POST /api/auth/logout`: Invalidate current session
- `POST /api/auth/refresh-token`: Refresh JWT token
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password with token
- `GET /api/auth/verify-email/:token`: Verify email address

### Users
- `GET /api/users/me`: Get current user profile
- `PUT /api/users/me`: Update current user profile
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user
- `GET /api/users`: List users

### Courses
- `GET /api/courses`: List courses
- `GET /api/courses/:id`: Get course details
- `POST /api/courses`: Create course
- `PUT /api/courses/:id`: Update course
- `DELETE /api/courses/:id`: Delete course
- `GET /api/courses/:id/modules`: Get course modules
- `POST /api/courses/:id/enroll`: Enroll in course

### Waitlist
- `POST /api/courses/:id/waitlist`: Join course waitlist
- `GET /api/courses/:id/waitlist`: Get waitlist status for current user
- `GET /api/courses/:id/waitlist/all`: Get all waitlist entries
- `PUT /api/courses/:id/waitlist/:entryId`: Update waitlist entry
- `DELETE /api/courses/:id/waitlist/:entryId`: Remove entry from waitlist
- `POST /api/courses/:id/waitlist/:entryId/invite`: Send enrollment invitation
- `POST /api/courses/:id/waitlist/:entryId/enroll`: Convert waitlist entry to enrollment
- `GET /api/users/me/waitlist`: Get all waitlist entries for current user
- `DELETE /api/users/me/waitlist/:entryId`: Remove self from waitlist

### Resources
- `GET /api/resources`: List resources
- `GET /api/resources/:id`: Get resource details
- `POST /api/resources`: Create resource
- `PUT /api/resources/:id`: Update resource
- `DELETE /api/resources/:id`: Delete resource

### Events
- `GET /api/events`: List events
- `GET /api/events/:id`: Get event details
- `POST /api/events`: Create event
- `PUT /api/events/:id`: Update event
- `DELETE /api/events/:id`: Delete event
- `POST /api/events/:id/register`: Register for event

### Forums
- `GET /api/forums/categories`: List forum categories
- `GET /api/forums/categories/:id/topics`: List topics in category
- `GET /api/forums/topics/:id`: Get topic details with posts
- `POST /api/forums/topics`: Create new topic
- `POST /api/forums/topics/:id/posts`: Add post to topic
- `PUT /api/forums/posts/:id`: Update post
- `DELETE /api/forums/posts/:id`: Delete post

### Notifications
- `GET /api/notifications`: Get user notifications
- `PUT /api/notifications/:id/read`: Mark notification as read
- `PUT /api/notifications/read-all`: Mark all notifications as read

### Settings
- `GET /api/settings`: Get user settings
- `PUT /api/settings`: Update user settings

### Settings II

#### `GET /api/settings`

- **Description**: Get user settings  
- **Authentication**: Required  
- **Returns**: Settings object

---

#### `PUT /api/settings`

- **Description**: Update user settings  
- **Authentication**: Required  
- **Body**: Settings fields  
- **Returns**: Updated settings object
