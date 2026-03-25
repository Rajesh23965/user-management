import { PaginationParams, ApiResponse } from '../types';
import { CONSTANTS } from './constants';


export class Helpers {

    static getPagination(page: number = 1, limit: number = CONSTANTS.PAGINATION.DEFAULT_LIMIT): PaginationParams {

        const safePage = Math.max(1, page);

        const safeLimit = Math.min(CONSTANTS.PAGINATION.MAX_LIMIT, Math.max(1, limit));


        const offset = (safePage - 1) * safeLimit;

        return {
            page: safePage,
            limit: safeLimit,
            offset
        };
    }


    static getPaginationMetadata(total: number, page: number, limit: number): any {
        const totalPages = Math.ceil(total / limit);

        return {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }


    static sanitizeUser(user: any): any {
        if (!user) return null;

        const userData = user.toJSON ? user.toJSON() : user;

        const { password, ...safeUser } = userData;

        return safeUser;
    }


    static formatResponse<T>(
        success: boolean,
        message: string,
        data?: T,
        error?: string
    ): ApiResponse<T> {
        return {
            success,
            message,
            data,
            error,
            timestamp: new Date().toISOString()
        };
    }


    static extractUserId(userIdParam: string | string[]): number | null {

        const userIdString = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;


        const userId = parseInt(userIdString);

        return isNaN(userId) ? null : userId;
    }
}