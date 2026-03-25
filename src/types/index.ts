export enum UserRole {
    ADMIN = 'admin',
    ROLE1 = 'role1',
    ROLE2 = 'role2',
    PENDING = 'pending'
}

export interface UserFields {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    username: string;
    password: string;
    role: UserRole;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    profilePicture?: string;
}

export interface UserUpdateInput {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePicture?: string;
}

export interface JwtPayload {
    id: number;
    username: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest extends UserCreateInput {
    confirmPassword: string;
}

export interface AssignRoleRequest {
    userId: number;
    role: UserRole;
}


export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

export interface UsersListResponse {
    users: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}