import express from 'express';
import { fetchBookings, assignBookingToOPD } from '../controllers/triage.controller.js';


import { protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/bookings', protectRoute, fetchBookings);


router.post('/assign-opd', protectRoute, assignBookingToOPD);

export default router;
