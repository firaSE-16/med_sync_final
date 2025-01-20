import express from 'express';
import {   completeUserProfile,
    updateUserProfile,
    getUserProfile,signup, 
    bookAppointment,
    fetchAppointment,
    fetchAppointments} from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'; 
import upload from '../lib/multer.js';
const router = express.Router();

router.post('/signup', signup)


router.put('/profile', protectRoute, completeUserProfile);





router.put('/updateProfile', protectRoute, upload.single('profilePic'), updateUserProfile);

router.get('/profile', protectRoute, getUserProfile);

router.post('/book-appointment', protectRoute, bookAppointment);
router.get('/booked-appointment', protectRoute,fetchAppointment)
router.get('/appointment', protectRoute,fetchAppointments)
export default router;
