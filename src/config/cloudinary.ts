import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export class CloudinaryService {
    private static instance: CloudinaryService;
    private readonly folder = process.env.CLOUDINARY_FOLDER || 'user-profiles';

    private constructor() { }

    public static getInstance(): CloudinaryService {
        if (!CloudinaryService.instance) {
            CloudinaryService.instance = new CloudinaryService();
        }
        return CloudinaryService.instance;
    }

    async uploadImage(
        buffer: Buffer,
        options?: any
    ): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: this.folder,
                    transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }],
                    ...options
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve({ url: result.secure_url, publicId: result.public_id });
                    else reject(new Error('Upload failed'));
                }
            );

            const readableStream = new Readable();
            readableStream.push(buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Failed to delete image:', error);
            return false;
        }
    }

    getPublicIdFromUrl(url: string): string | null {
        const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
        return matches ? matches[1] : null;
    }
}

export default cloudinary;