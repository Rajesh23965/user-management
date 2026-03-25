import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ImageService } from '../services/imageService';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';

const authService = AuthService.getInstance();
const imageService = new ImageService();

export class AuthController {

    /* Register User */
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let profilePictureUrl: string | undefined;

            if (req.file) {
                profilePictureUrl = await imageService.uploadProfilePicture(req.file);
            }

            const user = await authService.register(req.body, profilePictureUrl);

            res.status(201).json(
                Helpers.formatResponse(true, CONSTANTS.MESSAGES.REGISTER_SUCCESS, user)
            );
        } catch (error) {
            next(error);
        }
    }

    /* Login User */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;

            const result = await authService.login(username, password);

            if (!result) {
                res.status(401).json(
                    Helpers.formatResponse(false, CONSTANTS.MESSAGES.INVALID_CREDENTIALS)
                );
                return;
            }

            res.json(
                Helpers.formatResponse(true, CONSTANTS.MESSAGES.LOGIN_SUCCESS, result)
            );
        } catch (error: any) {
            next(error);
        }
    }

    /* Logout User */
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (token) {
                await authService.logout(token);
            }

            res.json(
                Helpers.formatResponse(true, CONSTANTS.MESSAGES.LOGOUT_SUCCESS)
            );
        } catch (error) {
            next(error);
        }
    }
}