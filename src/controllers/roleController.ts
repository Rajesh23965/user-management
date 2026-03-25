import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { UserRole } from '../types';
import { Helpers } from '../utils/helpers';

const userService = UserService.getInstance();

export class Role1Controller {

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
}

export class Role2Controller {

    /* Get Message */
    async getMessage(_req: Request, res: Response): Promise<void> {
        res.json(
            Helpers.formatResponse(true, 'Login successful! Welcome to Role 2 dashboard.', {
                message: 'You have successfully logged in with Role 2 access'
            })
        );
    }
}