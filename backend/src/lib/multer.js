import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary, // Cloudinary instance
  params: {
    folder: 'profiles', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'], // Allowed file formats
    resource_type: 'image', // Only allow image uploads
  },
});

// Set up multer with Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set file size limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const isValidExt = allowedFileTypes.test(file.mimetype);

    if (isValidExt) {
      cb(null, true); // Allow file upload
    } else {
      cb(
        new Error('Invalid file type. Only image files (jpeg, jpg, png, gif) are allowed.'),
        false
      ); // Reject invalid files
    }
  },
});

export default upload;
