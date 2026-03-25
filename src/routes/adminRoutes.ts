import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { upload } from '../services/imageService';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';
import { assignRoleValidator, updateUserValidator, getUsersValidator } from '../validators/userValidator';
import { validate } from '../middleware/validation';

const router = Router();
const adminController = new AdminController();

router.use(authenticate);
router.use(requireAdmin);

router.post(
    '/assign-role',
    assignRoleValidator,
    validate,
    adminController.assignRole
);

router.get(
    '/users',
    getUsersValidator,
    validate,
    adminController.getUsers
);

router.put(
    '/users/:userId',
    upload.single('profilePicture'),
    updateUserValidator,
    validate,
    adminController.editUser
);

router.delete(
    '/users/:userId',
    adminController.deleteUser
);

export default router;