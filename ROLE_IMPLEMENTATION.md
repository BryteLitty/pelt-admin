# Admin Operations Guide

## Overview

This guide provides comprehensive instructions for administrative operations including user management, role assignment, and system administration tasks.

## Base Information

- **API Base URL**: `http://localhost:3000/api/v1` (Development) / `https://your-domain.com/api/v1` (Production)
- **Authentication**: Bearer token required for all endpoints
- **Default SuperAdmin Password**: `SuperAdmin123!`

## Authentication

All admin operations require authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## User Management

### 1. Create New Admin User

**Endpoint**: `POST /users/staff`
**Required Role**: SUPERADMIN
**Sends Email**: ✅ Yes (with temporary password)

```bash
curl -X POST "http://localhost:3000/api/v1/users/staff" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "TempPassword123!",
    "role": "ADMIN",
    "department": "IT",
    "jobTitle": "System Administrator"
  }'
```

**Response**:
```json
{
  "id": "user-uuid",
  "email": "admin@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "userGroup": "ADMIN_USERS",
  "status": "ACTIVE",
  "emailVerified": true,
  "roles": [
    {
      "role": {
        "name": "ADMIN",
        "clearanceLevel": "LEVEL_2"
      }
    }
  ]
}
```

**Email Notification**: The new admin receives an email with:
- Welcome message
- Temporary password
- Login URL
- Role assignment details

### 2. Create Member User

**Endpoint**: `POST /users/staff`
**Required Role**: SUPERADMIN
**Sends Email**: ✅ Yes

```bash
curl -X POST "http://localhost:3000/api/v1/users/staff" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "TempPassword123!",
    "role": "MEMBER",
    "department": "Customer Support",
    "jobTitle": "Support Specialist"
  }'
```

### 3. List All Users

**Endpoint**: `GET /users`
**Required Role**: ADMIN, SUPERADMIN

```bash
curl -X GET "http://localhost:3000/api/v1/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get User Details

**Endpoint**: `GET /users/{userId}`
**Required Role**: ADMIN, SUPERADMIN (or self)

```bash
curl -X GET "http://localhost:3000/api/v1/users/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Update User

**Endpoint**: `PATCH /users/{userId}`
**Required Role**: ADMIN, SUPERADMIN (or self with limited fields)

```bash
curl -X PATCH "http://localhost:3000/api/v1/users/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated Name",
    "lastName": "Updated Last",
    "status": "SUSPENDED"
  }'
```

### 6. Delete User

**Endpoint**: `DELETE /users/{userId}`
**Required Role**: SUPERADMIN ONLY

```bash
curl -X DELETE "http://localhost:3000/api/v1/users/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**⚠️ Warning**: This permanently deletes the user and all related data.

## Role Management

### 1. Assign Role to User

**Endpoint**: `POST /roles/assign`
**Required Clearance**: LEVEL_2 (ADMIN and above)
**Sends Email**: ✅ Yes (role assignment notification)

```bash
curl -X POST "http://localhost:3000/api/v1/roles/assign" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "roleId": "role-uuid",
    "assignedBy": "admin-uuid"
  }'
```

**Email Notification**: The user receives an email with:
- Role assignment notification
- New permissions
- Assigned by information

### 2. Remove Role from User

**Endpoint**: `DELETE /roles/remove/{userId}/{roleId}`
**Required Clearance**: LEVEL_3 (SUPERADMIN ONLY)
**Sends Email**: ✅ Yes (role removal notification)

```bash
curl -X DELETE "http://localhost:3000/api/v1/roles/remove/user-uuid/role-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get User's Roles

**Endpoint**: `GET /roles/user/{userId}`
**Required Role**: ADMIN, SUPERADMIN

```bash
curl -X GET "http://localhost:3000/api/v1/roles/user/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get All Roles

**Endpoint**: `GET /roles`
**Required Role**: ADMIN, SUPERADMIN

```bash
curl -X GET "http://localhost:3000/api/v1/roles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Users with Specific Role

**Endpoint**: `GET /roles/users/{roleName}`
**Required Role**: ADMIN, SUPERADMIN

```bash
curl -X GET "http://localhost:3000/api/v1/roles/users/ADMIN" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## User Groups and Clearance

### 1. Get Users by Group

**General Users** (Customers):
```bash
curl -X GET "http://localhost:3000/api/v1/users/general-users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Admin Users** (Staff):
```bash
curl -X GET "http://localhost:3000/api/v1/users/admin-users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Get User's Clearance Level

**Endpoint**: `GET /roles/clearance/{userId}`

```bash
curl -X GET "http://localhost:3000/api/v1/roles/clearance/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. View Clearance Hierarchy

**Endpoint**: `GET /roles/clearance-hierarchy`

```bash
curl -X GET "http://localhost:3000/api/v1/roles/clearance-hierarchy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Role Hierarchy and Permissions

### Clearance Levels

| Level | Role | User Group | Permissions |
|-------|------|------------|-------------|
| LEVEL_0 | USER | GENERAL_USERS | Basic app access, Profile management |
| LEVEL_1 | MEMBER | ADMIN_USERS | Customer support access, Basic administration |
| LEVEL_2 | ADMIN | ADMIN_USERS | Full management access, User administration, System configuration |
| LEVEL_3 | SUPERADMIN | ADMIN_USERS | Complete system access, All administrative functions |

### Permission Matrix

| Operation | USER | MEMBER | ADMIN | SUPERADMIN |
|-----------|------|--------|-------|------------|
| View own profile | ✅ | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ | ✅ |
| View other users | ❌ | ❌ | ✅ | ✅ |
| Create regular users | ❌ | ❌ | ✅ | ✅ |
| Create staff | ❌ | ❌ | ❌ | ✅ |
| Assign roles | ❌ | ❌ | ✅ | ✅ |
| Remove roles | ❌ | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ✅ | ✅ |

## Email Notifications

The system automatically sends email notifications for:

### Role Assignment
- **Trigger**: When a role is assigned to a user
- **Recipient**: The user receiving the role
- **Content**:
  - Role name
  - Assigned by (admin name)
  - New permissions list
  - Effective date

### Role Removal
- **Trigger**: When a role is removed from a user
- **Recipient**: The user losing the role
- **Content**:
  - Role name that was removed
  - Removed by (admin name)
  - Reason (if provided)

### Staff Account Creation
- **Trigger**: When a new staff member is created
- **Recipient**: The new staff member
- **Content**:
  - Welcome message
  - Temporary password
  - Login URL
  - Role assignment
  - Next steps instructions

### Account Status Changes
- **Trigger**: When user status changes (ACTIVE, SUSPENDED, etc.)
- **Recipient**: The affected user
- **Content**:
  - Status change notification
  - Reason for change
  - Contact information for support

## Common Administrative Tasks

### 1. Onboard New Admin

1. Create staff account with ADMIN role
2. User receives email with temporary password
3. User logs in and changes password
4. Assign additional specific roles if needed
5. User receives role assignment notifications

### 2. Promote User to Admin

1. Get the user's ID: `GET /users`
2. Get ADMIN role ID: `GET /roles`
3. Assign ADMIN role: `POST /roles/assign`
4. User receives role assignment email

### 3. Suspend User Account

1. Update user status to SUSPENDED:
```bash
curl -X PATCH "http://localhost:3000/api/v1/users/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SUSPENDED"
  }'
```

### 4. Reactivate Suspended Account

1. Update user status to ACTIVE:
```bash
curl -X PATCH "http://localhost:3000/api/v1/users/user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE"
  }'
```

## Security Considerations

### 1. Account Lockout Protection
- Accounts are automatically locked after 5 failed login attempts
- Lockout duration: 30 minutes
- Automatic unlock after timeout period

### 2. Role Assignment Validation
- Only higher clearance levels can assign roles
- SUPERADMINs can assign any role
- ADMINs can assign USER and MEMBER roles only

### 3. Email Security
- All emails are sent via secure SMTP
- Temporary passwords are only sent once
- Email delivery failures don't block operations

### 4. Audit Logging
- All role assignments are logged
- User creation and deletion events are tracked
- Status changes are recorded with timestamps

## Error Handling

### Common Error Responses

**401 Unauthorized**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden**:
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

**404 Not Found**:
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

**409 Conflict**:
```json
{
  "statusCode": 409,
  "message": "User already has this role"
}
```

## Rate Limiting

- Login attempts: 5 per minute per IP
- Registration: 3 per hour per IP
- Password reset: 3 per 5 minutes per IP
- Email verification: 5 per hour per IP

## Best Practices

### 1. User Management
- Always use strong temporary passwords
- Require password change on first login
- Use descriptive department and job title fields
- Regularly audit user access

### 2. Role Assignment
- Follow principle of least privilege
- Document role assignments
- Review permissions regularly
- Use role removal for access revocation

### 3. Security
- Monitor failed login attempts
- Review audit logs regularly
- Keep temporary passwords secure
- Use HTTPS in production

### 4. Email Notifications
- Ensure email deliverability
- Monitor email failures
- Provide alternative contact methods
- Keep email templates updated

## Troubleshooting

### 1. Email Not Received
- Check spam/junk folders
- Verify email address spelling
- Check email service configuration
- Review email logs

### 2. Permission Denied
- Verify user role and clearance level
- Check JWT token validity
- Ensure proper authentication headers
- Review role hierarchy

### 3. Role Assignment Fails
- Verify user and role exist
- Check clearance level permissions
- Ensure no duplicate assignments
- Review validation rules

### 4. Account Lockout
- Wait for 30-minute timeout
- Use admin override if needed
- Check failed login logs
- Verify correct credentials

## Support and Contacts

For technical support or questions about admin operations:
- Email: admin@bitspenda.app
- Documentation: [API Documentation](./API-DOCUMENTATION.md)
- Security Issues: [Security Guide](./SECURITY-GUIDE.md)

---

**Last Updated**: $(date)
**Version**: 1.0
**Author**: Bitspenda Development Team