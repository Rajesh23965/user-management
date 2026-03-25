import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserRole, UserCreateInput, JwtPayload } from '../types';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';

export class AuthService {
    private static instance: AuthService;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async register(userData: UserCreateInput, profilePictureUrl?: string): Promise<any> {
        const existingUser = await User.findOne({ where: { username: userData.username } });
        if (existingUser) {
            throw new Error(CONSTANTS.MESSAGES.USERNAME_EXISTS);
        }

        const user = await User.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: userData.password,
            profilePicture: profilePictureUrl,
            role: UserRole.PENDING,
            isDeleted: false
        });

        return Helpers.sanitizeUser(user);
    }

    async login(username: string, password: string): Promise<{ token: string; user: any } | null> {
        const user = await User.findOne({
            where: { username, isDeleted: false }
        });

        if (!user) {
            return null;
        }

        /* Check if user has role assigned */
        if (user.role === UserRole.PENDING) {
            throw new Error(CONSTANTS.MESSAGES.ROLE_NOT_ASSIGNED);
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return null;
        }

        const payload: JwtPayload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }


        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        const token = jwt.sign(payload, jwtSecret, { expiresIn } as jwt.SignOptions);

        const userResponse = Helpers.sanitizeUser(user);

        return { token, user: userResponse };
    }

}