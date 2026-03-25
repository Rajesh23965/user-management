import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { upload } from '../services/imageService';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post(
    '/register',
    upload.single('profilePicture'),
    registerValidator,
    validate,
    authController.register
);

router.post(
    '/login',
    loginValidator,
    validate,
    authController.login
);

router.post(
    '/logout',
    authenticate,
    authController.logout
);

export default router;