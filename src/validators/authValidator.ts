import { body } from 'express-validator';
import { CONSTANTS } from '../utils/constants';

export const registerValidator = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: CONSTANTS.USER.FIRST_NAME_MIN, max: CONSTANTS.USER.FIRST_NAME_MAX })
        .withMessage(`First name must be ${CONSTANTS.USER.FIRST_NAME_MIN}-${CONSTANTS.USER.FIRST_NAME_MAX} characters`)
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters and spaces'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: CONSTANTS.USER.LAST_NAME_MIN, max: CONSTANTS.USER.LAST_NAME_MAX })
        .withMessage(`Last name must be ${CONSTANTS.USER.LAST_NAME_MIN}-${CONSTANTS.USER.LAST_NAME_MAX} characters`)
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters and spaces'),

    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: CONSTANTS.USER.USERNAME_MIN, max: CONSTANTS.USER.USERNAME_MAX })
        .withMessage(`Username must be ${CONSTANTS.USER.USERNAME_MIN}-${CONSTANTS.USER.USERNAME_MAX} characters`)
        .isAlphanumeric().withMessage('Username must be alphanumeric')
        .toLowerCase(),

    body('password')
        .isLength({ min: CONSTANTS.USER.PASSWORD_MIN })
        .withMessage(`Password must be at least ${CONSTANTS.USER.PASSWORD_MIN} characters`)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
];

export const loginValidator = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
];