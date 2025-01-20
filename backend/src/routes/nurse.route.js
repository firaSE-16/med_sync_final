import express from 'express';
import { fetchPatients, assignAppointment, fetchDoctors } from '../controllers/nurse.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'; 
const router = express.Router();

router.get('/patients', protectRoute, fetchPatients); 
router.post('/appointments', protectRoute, assignAppointment); 
router.get('/doctors', protectRoute, fetchDoctors); 
export default router;
