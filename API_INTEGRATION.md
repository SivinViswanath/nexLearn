# API Integration Documentation

## Base URL

```
https://nexlearn.noviindusdemosites.in
```

## Authentication Flow

### 1. Send OTP

**Endpoint**: `POST /auth/send-otp`

**Request** (Form Data):

```
mobile: string (10-digit mobile number)
```

**Response**:

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP

**Endpoint**: `POST /auth/verify-otp`

**Request** (Form Data):

```
mobile: string
otp: string
```

**Response** (Existing User):

```json
{
  "success": true,
  "login": true,
  "message": "Login successful",
  "access_token": "jwt_token",
  "refresh_token": "jwt_refresh_token",
  "token_type": "Bearer"
}
```

**Response** (New User):

```json
{
  "success": true,
  "login": false,
  "message": "Please complete your profile"
}
```

### 3. Create Profile

**Endpoint**: `POST /auth/create-profile`

**Request** (Form Data):

```
mobile: string
name: string
email: string
qualification: string
profile_image: file
```

**Response**:

```json
{
  "success": true,
  "access_token": "jwt_token",
  "refresh_token": "jwt_refresh_token",
  "message": "Profile created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "qualification": "B.Tech"
  }
}
```

### 4. Logout

**Endpoint**: `POST /auth/logout`

**Headers**:

```
Authorization: Bearer {access_token}
```

**Response**:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Exam Endpoints

### 1. List Questions

**Endpoint**: `GET /question/list`

**Headers**:

```
Authorization: Bearer {access_token}
```

**Response**:

```json
{
  "success": true,
  "questions_count": 20,
  "total_marks": 100,
  "total_time": 3600,
  "time_for_each_question": 180,
  "mark_per_each_answer": 5,
  "instruction": "Read carefully\nManage your time\nNo negative marking",
  "questions": [
    {
      "id": 1,
      "question": "What is 2+2?",
      "options": [
        {
          "id": 1,
          "option": "2"
        },
        {
          "id": 2,
          "option": "3"
        },
        {
          "id": 3,
          "option": "4"
        },
        {
          "id": 4,
          "option": "5"
        }
      ]
    }
  ]
}
```

### 2. Submit Answers

**Endpoint**: `POST /answers/submit`

**Headers**:

```
Authorization: Bearer {access_token}
```

**Request** (Form Data):

```
answers: JSON string
```

**Answer Format**:

```json
[
  {
    "question_id": 1,
    "selected_option_id": 3
  },
  {
    "question_id": 2,
    "selected_option_id": null
  }
]
```

**Response**:

```json
{
  "success": true,
  "exam_history_id": "abc123",
  "score": 85,
  "correct": 17,
  "wrong": 2,
  "not_attended": 1,
  "submitted_at": "2025-11-13T10:30:00Z",
  "details": [
    {
      "question_id": 1,
      "is_correct": true,
      "selected_option_id": 3,
      "correct_option_id": 3
    }
  ]
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes**:

- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `500` - Server Error

---

## Implementation Details

### Authentication Storage

- Access token stored in cookie: `accessToken`
- Refresh token stored in cookie: `refreshToken`
- Tokens expire after 7 days (access) and 30 days (refresh)

### Request Headers

All authenticated requests include:

```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data (for form data)
Content-Type: application/json (for JSON)
```

### Axios Interceptors

- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles 401 errors and redirects to login

---

## Frontend Integration

### Login Flow

1. User enters mobile number
2. Frontend calls `/auth/send-otp`
3. User enters OTP
4. Frontend calls `/auth/verify-otp`
5. If `login: true`, store tokens and redirect to instructions
6. If `login: false`, show profile form
7. User fills profile and uploads image
8. Frontend calls `/auth/create-profile`
9. Store tokens and redirect to instructions

### Exam Flow

1. User clicks "Start Assessment" on instructions page
2. Frontend calls `/question/list` to fetch questions
3. Display questions with timer
4. User answers questions
5. On submit or timeout, frontend calls `/answers/submit`
6. Redirect to results page with exam_history_id

### Logout Flow

1. User clicks logout
2. Frontend calls `/auth/logout`
3. Clear cookies and Redux state
4. Redirect to login page

---

## Testing

### Test with Postman/cURL

**Send OTP**:

```bash
curl -X POST https://nexlearn.noviindusdemosites.in/auth/send-otp \
  -F "mobile=1234567890"
```

**Verify OTP**:

```bash
curl -X POST https://nexlearn.noviindusdemosites.in/auth/verify-otp \
  -F "mobile=1234567890" \
  -F "otp=123456"
```

**Get Questions**:

```bash
curl -X GET https://nexlearn.noviindusdemosites.in/question/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Submit Answers**:

```bash
curl -X POST https://nexlearn.noviindusdemosites.in/answers/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F 'answers=[{"question_id":1,"selected_option_id":3}]'
```

---

## Notes

1. **CORS**: API should have CORS enabled for localhost:3000
2. **File Upload**: Profile image should be less than 5MB
3. **Mobile Format**: 10-digit Indian mobile number
4. **OTP Format**: 4-6 digit numeric code
5. **Timer**: Total time is in seconds, convert to minutes for display
6. **Answers**: Use `null` for unanswered questions

---

## Environment Variables

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://nexlearn.noviindusdemosites.in
```

---

**Last Updated**: November 13, 2025
