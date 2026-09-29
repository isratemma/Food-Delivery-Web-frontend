import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

/* ── Reusable factory ────────────────────────────────────────
   Creates a multer upload middleware for a given folder.
   Usage:
     import { uploadImage } from '../middlewares/upload.js';
     router.post('/shop', protect, uploadImage('shops'), createShop);
──────────────────────────────────────────────────────────── */
const createUpload = (folder = 'general') => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder:         `vingolink/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed.'), false);
      }
    },
  });
};

// Pre-built uploads for common folders
export const uploadShopImage  = createUpload('shops').single('image');
export const uploadItemImage  = createUpload('items').single('image');
export const uploadAvatar     = createUpload('avatars').single('image');

// Generic — pass folder name at runtime
export const uploadImage = (folder) => createUpload(folder).single('image');
