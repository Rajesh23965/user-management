import multer from 'multer';
import { CloudinaryService } from '../config/cloudinary';
import { CONSTANTS } from '../utils/constants';

const cloudinaryService = CloudinaryService.getInstance();

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: CONSTANTS.UPLOAD.MAX_SIZE
    },
    fileFilter: (_req, file, cb) => {
        // Convert readonly array to regular array or check directly
        const allowedTypes = CONSTANTS.UPLOAD.ALLOWED_TYPES;

        // Type assertion for includes check
        if ((allowedTypes as readonly string[]).includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
        }
    }
});

export class ImageService {
    async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
        const result = await cloudinaryService.uploadImage(file.buffer, {
            transformation: [
                { width: 500, height: 500, crop: 'limit', quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });
        return result.url;
    }

    async deleteProfilePicture(imageUrl: string): Promise<boolean> {
        const publicId = cloudinaryService.getPublicIdFromUrl(imageUrl);
        if (publicId) {
            return await cloudinaryService.deleteImage(publicId);
        }
        return false;
    }
}