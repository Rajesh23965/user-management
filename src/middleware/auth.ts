import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';
import User from '../models/User';
import redis from '../config/redis';
import { CONSTANTS } from '../utils/constants';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.UNAUTHORIZED
            });
            return;
        }

        /* Check if token is blacklisted */
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.TOKEN_INVALID
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        /* Check if user exists and is not deleted */
        const user = await User.findOne({
            where: { id: decoded.id, isDeleted: false },
            attributes: ['id', 'username', 'role']
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.USER_NOT_FOUND
            });
            return;
        }

        req.user = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.TOKEN_EXPIRED
            });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.TOKEN_INVALID
            });
        } else {
            res.status(401).json({
                success: false,
                message: CONSTANTS.MESSAGES.UNAUTHORIZED
            });
        }
    }
};