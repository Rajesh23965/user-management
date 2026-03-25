import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from 'sequelize';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            success: false,
            message: 'Username already exists',
            error: err.message
        });
        return;
    }

    if (err instanceof SequelizeValidationError) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => e.message)
        });
        return;
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB'
        });
        return;
    }

    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};