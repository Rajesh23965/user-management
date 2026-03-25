import { Router } from 'express';
import { Role1Controller, Role2Controller } from '../controllers/roleController';
import { authenticate } from '../middleware/auth';
import { requireRole1, requireRole2 } from '../middleware/roleCheck';
import { getUsersValidator } from '../validators/userValidator';
import { validate } from '../middleware/validation';

const router = Router();
const role1Controller = new Role1Controller();
const role2Controller = new Role2Controller();

// Role 1 routes
router.get(
    '/role1/users',
    authenticate,
    requireRole1,
    getUsersValidator,
    validate,
    role1Controller.getUsers
);

// Role 2 routes
router.get(
    '/role2/message',
    authenticate,
    requireRole2,
    role2Controller.getMessage
);

export default router;