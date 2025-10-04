# Pelt Admin API Testing Guide

## Overview
This guide provides comprehensive instructions for testing the Pelt Admin API using the included Postman collection.

## Prerequisites
- Postman installed on your system
- Running backend server
- Valid test credentials

## Setup Instructions

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select the `Pelt_Admin_API.postman_collection.json` file
4. The collection will be imported with all endpoints and environment variables

### 2. Environment Configuration
The collection includes the following variables that can be customized:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `http://localhost:3001/api` | Backend API base URL |
| `authToken` | (auto-set) | JWT token from login response |
| `testEmail` | `admin@pelt.com` | Default test email |
| `testPassword` | `admin123` | Default test password |

### 3. Backend Server Requirements
Ensure your backend server is running and accessible at the configured `baseUrl`. The API should support the following base path:
```
http://localhost:3001/api
```

## API Endpoints Documentation

### Authentication Endpoints

#### 1. Login
- **Method**: POST
- **URL**: `/auth/login`
- **Purpose**: Authenticate user and receive access token
- **Request Body**:
  ```json
  {
    "email": "admin@pelt.com",
    "password": "admin123"
  }
  ```
- **Response**: Returns user object and access token
- **Note**: Token is automatically saved to `authToken` variable

#### 2. Get Profile
- **Method**: GET
- **URL**: `/auth/profile`
- **Purpose**: Get current user's profile information
- **Auth**: Requires Bearer token
- **Response**: User profile with roles and permissions

#### 3. Password Reset Flow
- **Request Reset**: POST `/auth/request-password-reset`
- **Reset Password**: POST `/auth/reset-password`
- **Complete Reset**: POST `/auth/complete-password-reset`

#### 4. Change Password
- **Method**: POST
- **URL**: `/auth/change-password`
- **Auth**: Requires Bearer token
- **Request Body**:
  ```json
  {
    "currentPassword": "current123",
    "newPassword": "newPassword123"
  }
  ```

### User Management Endpoints

#### 1. Get Admin Users
- **Method**: GET
- **URL**: `/users/admin-users`
- **Purpose**: Retrieve all admin users with roles
- **Auth**: Requires Bearer token
- **Response**: Array of admin users with role information

#### 2. Get General Users
- **Method**: GET
- **URL**: `/users/general-users`
- **Purpose**: Retrieve all general users
- **Auth**: Requires Bearer token
- **Response**: Array of general users

#### 3. Create Admin User
- **Method**: POST
- **URL**: `/users/staff`
- **Purpose**: Create new admin user
- **Auth**: Requires Bearer token (SUPERADMIN role)
- **Request Body**:
  ```json
  {
    "email": "newadmin@pelt.com",
    "firstName": "New",
    "lastName": "Admin",
    "password": "password123",
    "role": "ADMIN",
    "department": "IT",
    "jobTitle": "Administrator"
  }
  ```

#### 4. Update User
- **Method**: PATCH
- **URL**: `/users/:userId`
- **Purpose**: Update user information
- **Auth**: Requires Bearer token
- **Request Body**:
  ```json
  {
    "firstName": "Updated",
    "lastName": "Name",
    "status": "ACTIVE"
  }
  ```

#### 5. Update User Status
- **Method**: PATCH
- **URL**: `/users/:userId`
- **Purpose**: Activate or suspend user
- **Auth**: Requires Bearer token
- **Request Body**:
  ```json
  {
    "status": "SUSPENDED"
  }
  ```

#### 6. Delete User
- **Method**: DELETE
- **URL**: `/users/:userId`
- **Purpose**: Permanently delete user
- **Auth**: Requires Bearer token (SUPERADMIN role)

### Role Management Endpoints

#### 1. Get All Roles
- **Method**: GET
- **URL**: `/roles`
- **Purpose**: Retrieve all available roles
- **Auth**: Requires Bearer token
- **Response**: Array of roles with permissions

#### 2. Assign Role to User
- **Method**: POST
- **URL**: `/roles/assign`
- **Purpose**: Assign role to user
- **Auth**: Requires Bearer token (SUPERADMIN role)
- **Request Body**:
  ```json
  {
    "userId": "user-id-here",
    "roleId": "role-id-here",
    "assignedBy": "current-user-id"
  }
  ```

#### 3. Remove Role from User
- **Method**: DELETE
- **URL**: `/roles/remove/:userId/:roleId`
- **Purpose**: Remove role from user
- **Auth**: Requires Bearer token (SUPERADMIN role)

## Permission Matrix

| Role | Admin Users | General Users | Role Management | Delete Users |
|------|-------------|---------------|-----------------|--------------|
| SUPERADMIN | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Yes |
| ADMIN | ✅ View/Edit (except SUPERADMIN) | ✅ Full Access | ❌ No | ❌ No |
| MEMBER | ❌ No | ✅ View/Suspend Only | ❌ No | ❌ No |

## Test Credentials

### Default Test Users
You'll need to have these users created in your backend database:

#### Super Admin
- **Email**: `superadmin@pelt.com`
- **Password**: `superadmin123`
- **Role**: SUPERADMIN

#### Admin User
- **Email**: `admin@pelt.com`
- **Password**: `admin123`
- **Role**: ADMIN

#### Member User
- **Email**: `member@pelt.com`
- **Password**: `member123`
- **Role**: MEMBER

### Testing Different Permission Levels
1. Login with different user roles
2. Test endpoints to verify permission restrictions
3. Ensure proper error responses for unauthorized actions

## Common Test Scenarios

### 1. Authentication Flow
1. Run "Login" request with valid credentials
2. Verify token is saved automatically
3. Run "Get Profile" to confirm authentication
4. Test other endpoints with the token

### 2. Admin User Management
1. Login as SUPERADMIN
2. Get list of admin users
3. Create new admin user
4. Update user information
5. Assign/remove roles
6. Delete user (if needed)

### 3. General User Management
1. Login as ADMIN or MEMBER
2. Get list of general users
3. Test permission-based access
4. Update user status (suspend/activate)

### 4. Permission Testing
1. Login as MEMBER
2. Try to access admin-only endpoints
3. Verify proper 403 Forbidden responses
4. Test allowed operations (view general users, suspend)

## Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **422**: Unprocessable Entity (validation failed)
- **500**: Internal Server Error

### Debugging Tips
1. Check the Console tab in Postman for detailed error messages
2. Verify the `authToken` variable is set after login
3. Ensure backend server is running and accessible
4. Check request headers include proper Authorization
5. Validate request body format and required fields

## Environment Variables for Different Environments

### Development
```
baseUrl: http://localhost:3001/api
testEmail: admin@pelt.com
testPassword: admin123
```

### Staging
```
baseUrl: https://staging-api.pelt.com/api
testEmail: staging.admin@pelt.com
testPassword: staging123
```

### Production
```
baseUrl: https://api.pelt.com/api
testEmail: [use production credentials]
testPassword: [use production credentials]
```

## Session Management

### Automatic Logout on Token Expiration
The admin application includes automatic session management:
- **Token Expiry**: After 15 minutes of inactivity, the access token expires
- **Automatic Logout**: When a 401 Unauthorized response is received, the user is automatically logged out
- **Redirect to Frontend**: Users are redirected to the main frontend application (not the admin login page)
- **Clean State**: All auth state and localStorage data is cleared

### Environment Configuration
Configure the frontend redirect URL in your environment:
```bash
# .env file
VITE_FRONTEND_URL=https://your-frontend-app.com
```

## Security Notes
- Never commit real production credentials to version control
- Use environment-specific test accounts
- Rotate test credentials regularly
- Ensure proper HTTPS in production environments
- Test rate limiting and security headers

## Support
For issues with the API or this testing guide, please:
1. Check backend server logs
2. Verify database connectivity
3. Ensure all required environment variables are set
4. Contact the development team with specific error messages