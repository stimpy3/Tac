# Authentication System Documentation

## Overview
This project now implements a secure authentication system using JWT tokens, password hashing, and protected routes.

## Features

### 🔐 Security Features
- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Protected Routes**: Client-side and server-side route protection
- **Token Verification**: Automatic token validation on protected routes
- **Secure Logout**: Proper token cleanup on logout

### 🌐 Authentication Methods
- **Email/Password Registration & Login**: Traditional authentication
- **Google OAuth**: Social login with automatic account creation
- **Automatic Token Management**: Tokens are automatically included in API requests

## Server-Side Implementation

### Dependencies
```bash
npm install jsonwebtoken bcrypt
```

### Key Endpoints

#### 1. Register (`POST /register`)
```javascript
// Request
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Login (`POST /login`)
```javascript
// Request
{
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Google OAuth (`POST /google-login`)
```javascript
// Request
{
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/..."
}

// Response
{
  "message": "Google login successful",
  "user": {
    "_id": "...",
    "username": "John Doe",
    "email": "user@gmail.com",
    "picture": "https://lh3.googleusercontent.com/..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Token Verification (`POST /verify-token`)
```javascript
// Headers
Authorization: Bearer <token>

// Response
{
  "message": "Token is valid",
  "user": {
    "userId": "...",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

### Middleware
- **`authenticateToken`**: Verifies JWT tokens for protected routes
- **CORS Configuration**: Configured for localhost and production domains
- **Error Handling**: Comprehensive error responses

## Client-Side Implementation

### Auth Utility (`src/utils/auth.js`)
```javascript
import api, { logout, getCurrentUser, isAuthenticated, verifyToken } from '../utils/auth';

// Make authenticated API calls
const response = await api.get('/protected-endpoint');

// Check authentication status
if (isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = getCurrentUser();

// Logout
logout();
```

### Protected Routes (`src/components/auth/privateRoutes.jsx`)
```javascript
<Route path="/home" element={
  <PrivateRoute>
    <HomePage />
  </PrivateRoute>
}/>
```

### Features
- **Automatic Token Inclusion**: All API requests automatically include JWT tokens
- **Token Expiration Handling**: Automatic logout on token expiration
- **Loading States**: Smooth loading experience during authentication checks
- **Error Handling**: Graceful error handling for authentication failures

## Security Best Practices

### ✅ Implemented
- Password hashing with bcrypt
- JWT token expiration (24 hours)
- Secure token storage in localStorage
- Server-side token verification
- CORS protection
- Input validation
- Error handling without sensitive data exposure

### 🔒 Additional Recommendations
1. **Environment Variables**: Move JWT_SECRET to environment variables
2. **HTTPS**: Use HTTPS in production
3. **Rate Limiting**: Implement rate limiting for auth endpoints
4. **Password Policy**: Enforce strong password requirements
5. **Account Lockout**: Implement account lockout after failed attempts
6. **Refresh Tokens**: Consider implementing refresh tokens for better UX

## Usage Examples

### Registration
```javascript
const handleRegister = async (userData) => {
  try {
    const response = await axios.post('/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/home');
  } catch (error) {
    alert(error.response.data.message);
  }
};
```

### Login
```javascript
const handleLogin = async (credentials) => {
  try {
    const response = await axios.post('/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/home');
  } catch (error) {
    alert(error.response.data.message);
  }
};
```

### Protected API Calls
```javascript
// Using the auth utility
const response = await api.get('/profile');

// Or manually with token
const token = localStorage.getItem('token');
const response = await axios.get('/profile', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## File Structure
```
├── server/
│   ├── index.js              # Main server with auth endpoints
│   ├── models/
│   │   └── user.js           # User model with picture field
│   └── package.json
├── client/
│   ├── src/
│   │   ├── utils/
│   │   │   └── auth.js       # Auth utility functions
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── privateRoutes.jsx  # Protected route wrapper
│   │   │   ├── loginRegister/
│   │   │   │   ├── loginform.jsx      # Login form with JWT
│   │   │   │   └── registerform.jsx   # Register form with JWT
│   │   │   └── home/
│   │   │       └── topbar.jsx         # Topbar with logout
│   │   └── App.jsx           # Main app with protected routes
│   └── package.json
└── AUTHENTICATION_README.md  # This file
```

## Testing the Authentication

1. **Start the server**: `cd server && npm start`
2. **Start the client**: `cd client && npm run dev`
3. **Test Registration**: Create a new account
4. **Test Login**: Login with existing credentials
5. **Test Google OAuth**: Use Google login
6. **Test Protected Routes**: Navigate to /home
7. **Test Logout**: Click logout button
8. **Test Token Expiration**: Wait for token to expire or manually delete from localStorage

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure server CORS is configured for your client URL
2. **Token Not Found**: Check if token is properly stored in localStorage
3. **Invalid Token**: Token may have expired, try logging in again
4. **MongoDB Connection**: Ensure MongoDB is running on localhost:27017

### Debug Tips
- Check browser console for client-side errors
- Check server console for server-side errors
- Verify token format in localStorage
- Test API endpoints with Postman or similar tool 