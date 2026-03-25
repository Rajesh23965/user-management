import User from '../models/User';
import { UserRole } from '../types';
import redis from '../config/redis';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';

export class UserService {
    private static instance: UserService;
    private readonly CACHE_TTL = CONSTANTS.CACHE.USER;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async getUsers(
        role?: UserRole,
        page: number = CONSTANTS.PAGINATION.DEFAULT_PAGE,
        limit: number = CONSTANTS.PAGINATION.DEFAULT_LIMIT
    ): Promise<any> {
        const { offset, page: pageNum, limit: limitNum } = Helpers.getPagination(page, limit);
        const cacheKey = `users:${role || 'all'}:${pageNum}:${limitNum}`;

        // Try cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return cached;
        }

        const where: any = { isDeleted: false };
        if (role) {
            where.role = role;
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            limit: limitNum,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const result = {
            users: rows,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum),
                hasNext: pageNum < Math.ceil(count / limitNum),
                hasPrev: pageNum > 1
            }
        };

        // Cache result
        await redis.set(cacheKey, result, this.CACHE_TTL);

        return result;
    }

    async getUserById(id: number): Promise<any | null> {
        const cacheKey = `user:${id}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return cached;
        }

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (user && !user.isDeleted) {
            const sanitized = Helpers.sanitizeUser(user);
            await redis.set(cacheKey, sanitized, this.CACHE_TTL);
            return sanitized;
        }

        return null;
    }

    async updateUser(id: number, updateData: any, profilePictureUrl?: string): Promise<any | null> {
        const user = await User.findByPk(id);

        if (!user || user.isDeleted) {
            return null;
        }

        if (profilePictureUrl) {
            updateData.profilePicture = profilePictureUrl;
        }

        await user.update(updateData);

        // Clear cache
        await redis.del(`user:${id}`);
        await this.clearUserListCache();

        return Helpers.sanitizeUser(user);
    }

    async softDeleteUser(id: number): Promise<boolean> {
        const user = await User.findByPk(id);

        if (!user || user.isDeleted) {
            return false;
        }

        await user.destroy();
        await redis.del(`user:${id}`);
        await this.clearUserListCache();

        return true;
    }

    async assignRole(id: number, role: UserRole): Promise<any | null> {
        const user = await User.findByPk(id);

        if (!user || user.isDeleted) {
            return null;
        }

        await user.update({ role });
        await redis.del(`user:${id}`);
        await this.clearUserListCache();

        return Helpers.sanitizeUser(user);
    }

    private async clearUserListCache(): Promise<void> {
        const keys = await redis.keys('users:*');
        if (keys.length) {
            for (const key of keys) {
                await redis.del(key);
            }
        }
    }
}