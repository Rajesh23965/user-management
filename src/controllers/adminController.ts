import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ImageService } from '../services/imageService';
import { UserRole } from '../types';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';

const userService = UserService.getInstance();
const imageService = new ImageService();

export class AdminController {

    /* Assign Role */
    async assignRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role } = req.body;

            if (!Object.values(UserRole).includes(role) || role === UserRole.PENDING) {
                res.status(400).json(
                    Helpers.formatResponse(false, 'Invalid role')
                );
                return;
            }

            const userIdNum = Helpers.extractUserId(userId);
            if (!userIdNum) {
                res.status(400).json(
                    Helpers.formatResponse(false, 'Invalid user ID')
                );
                return;
            }

            const user = await userService.assignRole(userIdNum, role);

            if (!user) {
                res.status(404).json(
                    Helpers.formatResponse(false, CONSTANTS.MESSAGES.USER_NOT_FOUND)
                );
                return;
            }

            res.json(
                Helpers.formatResponse(true, `${CONSTANTS.MESSAGES.ROLE_ASSIGNED} as ${role}`, user)
            );
        } catch (error) {
            next(error);
        }
    }

    /* Get Users */
    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const role = req.query.role as UserRole;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await userService.getUsers(role, page, limit);

            res.json(
                Helpers.formatResponse(true, 'Users fetched successfully', result)
            );
        } catch (error) {
            next(error);
        }
    }

    /* Update User */
    async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Helpers.extractUserId(req.params.userId);

            if (!userId) {
                res.status(400).json(
                    Helpers.formatResponse(false, 'Invalid user ID')
                );
                return;
            }

            const updateData = req.body;
            delete updateData.role;

            let profilePictureUrl: string | undefined;
            if (req.file) {
                const oldUser = await userService.getUserById(userId);
                if (oldUser?.profilePicture) {
                    await imageService.deleteProfilePicture(oldUser.profilePicture);
                }
                profilePictureUrl = await imageService.uploadProfilePicture(req.file);
            }

            const user = await userService.updateUser(userId, updateData, profilePictureUrl);

            if (!user) {
                res.status(404).json(
                    Helpers.formatResponse(false, CONSTANTS.MESSAGES.USER_NOT_FOUND)
                );
                return;
            }

            res.json(
                Helpers.formatResponse(true, CONSTANTS.MESSAGES.USER_UPDATED, user)
            );
        } catch (error) {
            next(error);
        }
    }

    /* Delete User */
    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Helpers.extractUserId(req.params.userId);

            if (!userId) {
                res.status(400).json(
                    Helpers.formatResponse(false, 'Invalid user ID')
                );
                return;
            }

            const deleted = await userService.softDeleteUser(userId);

            if (!deleted) {
                res.status(404).json(
                    Helpers.formatResponse(false, CONSTANTS.MESSAGES.USER_NOT_FOUND)
                );
                return;
            }

            res.json(
                Helpers.formatResponse(true, CONSTANTS.MESSAGES.USER_DELETED)
            );
        } catch (error) {
            next(error);
        }
    }
}