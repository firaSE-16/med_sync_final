import express from 'express';
import { addStaff, updateStaff, deleteStaff, fetchAllStaff } from '../controllers/admin.controller.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

// Configure Multer-Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === 'profilePic' ? 'profiles' : 'additional-files';
    return {
      folder, // Folder name in Cloudinary
      format: 'png', // Optional: Specify file format (e.g., png, jpg)
      public_id: `${Date.now()}-${file.originalname}`, // Unique public ID for the file
    };
  },
});

const upload = multer({ storage });

// Route Handlers
router.post(
  '/add',
  upload.fields([
    { name: 'profilePic', maxCount: 1 }, // Handle a single file for 'profilePic'
    { name: 'additionalFiles', maxCount: 5 }, // Optionally handle multiple files for 'additionalFiles'
  ]),
  async (req, res) => {
    try {
      // Access uploaded files
      const profilePic = req.files['profilePic'] ? req.files['profilePic'][0] : null;
      const additionalFiles = req.files['additionalFiles'] || [];

      // Access form data (other fields)
      const formData = req.body;

      console.log('Profile Picture:', profilePic);
      console.log('Additional Files:', additionalFiles);
      console.log('Form Data:', formData);

      // TODO: Save formData and file information to the database
      res.status(200).json({
        message: 'Staff added successfully!',
        profilePic,
        additionalFiles,
        formData,
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ message: error.message || 'Failed to process request.' });
    }
  }
);

router.post('/', addStaff);

router.put('/update/:role/:id', updateStaff);

router.delete('/delete/:role/:id', deleteStaff);

router.get('/fetch/:role', fetchAllStaff);

export default router;
