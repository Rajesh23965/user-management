import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { CONSTANTS } from '../utils/constants';

export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.UNAUTHORIZED
            });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: CONSTANTS.MESSAGES.FORBIDDEN
            });
            return;
        }

        next();
    };
};

export const requireAdmin = requireRole(UserRole.ADMIN);
export const requireRole1 = requireRole(UserRole.ROLE1);
export const requireRole2 = requireRole(UserRole.ROLE2);