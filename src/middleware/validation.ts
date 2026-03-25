import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CONSTANTS } from '../utils/constants';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: CONSTANTS.MESSAGES.VALIDATION_ERROR,
            errors: errors.array()
        });
        return;
    }
    next();
};