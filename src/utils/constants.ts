export const CONSTANTS = {
    USER: {
        FIRST_NAME_MIN: 2,
        FIRST_NAME_MAX: 50,
        LAST_NAME_MIN: 2,
        LAST_NAME_MAX: 50,
        USERNAME_MIN: 3,
        USERNAME_MAX: 50,
        PASSWORD_MIN: 8
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100
    },
    CACHE: {
        USER: 300,
        USERS_LIST: 300
    },
    RATE_LIMIT: {
        AUTH: {
            WINDOW_MS: 15 * 60 * 1000,
            MAX: 5
        },
        API: {
            WINDOW_MS: 15 * 60 * 1000,
            MAX: 100
        }
    },
    UPLOAD: {
        MAX_SIZE: 5 * 1024 * 1024, /* Maximum file size (5MB) */
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'] as const
    },
    MESSAGES: {
        REGISTER_SUCCESS: 'User registered successfully. Waiting for admin approval.',
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logged out successfully',
        ROLE_ASSIGNED: 'Role assigned successfully',
        USER_UPDATED: 'User updated successfully',
        USER_DELETED: 'User deleted successfully',
        INVALID_CREDENTIALS: 'Invalid credentials',
        UNAUTHORIZED: 'Authentication required',
        FORBIDDEN: 'Insufficient permissions',
        USER_NOT_FOUND: 'User not found',
        USERNAME_EXISTS: 'Username already exists',
        ROLE_NOT_ASSIGNED: 'Role not assigned yet. Please wait for admin approval.',
        TOKEN_INVALID: 'Invalid token',
        TOKEN_EXPIRED: 'Token expired',
        VALIDATION_ERROR: 'Validation failed'
    }
} as const;

export type AllowedMimeTypes = typeof CONSTANTS.UPLOAD.ALLOWED_TYPES[number];