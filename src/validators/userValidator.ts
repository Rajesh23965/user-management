import { body, param, query } from 'express-validator';

export const updateUserValidator = [
    param('userId')
        .isInt({ min: 1 }).withMessage('Invalid user ID'),

    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters and spaces'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters and spaces'),

    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
        .isAlphanumeric().withMessage('Username must be alphanumeric')
        .toLowerCase()
];

export const assignRoleValidator = [
    body('userId')
        .isInt({ min: 1 }).withMessage('Invalid user ID'),

    body('role')
        .isIn(['admin', 'role1', 'role2']).withMessage('Invalid role')
];

export const getUsersValidator = [
    query('role')
        .optional()
        .isIn(['admin', 'role1', 'role2', 'pending']).withMessage('Invalid role'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt()
];