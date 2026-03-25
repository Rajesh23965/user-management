# User Management System

A complete user management system with role-based access control (Admin, Role1, Role2).

## Features

- ✅ User Registration with Profile Picture
- ✅ Role-Based Access (Admin, Role1, Role2)
- ✅ JWT Authentication
- ✅ Admin: Assign roles, View/Edit/Delete users
- ✅ Role1: View users list with filters
- ✅ Role2: Login success message only
- ✅ Soft Delete functionality
- ✅ Redis Caching
- ✅ Rate Limiting
- ✅ MySQL Database

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL, Sequelize ORM
- **Cache**: Redis
- **Storage**: Cloudinary (images)
- **Testing**: Jest, Supertest

## Installation

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd user-management-system
npm install
<img width="1305" height="700" alt="image" src="https://github.com/user-attachments/assets/d720330c-4a78-4595-b787-d9530232e564" />

Register API: http://localhost:3000/api/auth/register
LoginAPI: http://localhost:3000/api/auth/login
Assign Role :http://localhost:3000/api/admin/assign-role
