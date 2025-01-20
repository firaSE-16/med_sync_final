import express from 'express';
import { fillLabResultsForm, getAllPatientsWithLabRequests } from '../controllers/laboratorist.controller.js';  
import { protectRoute } from '../middleware/auth.middleware.js';  

const router = express.Router();


router.put('/:id/results',protectRoute,fillLabResultsForm); // PUT request to update lab request with results

// Route for fetching all patients associated with lab requests
router.get('/patients-with-lab-requests',protectRoute, getAllPatientsWithLabRequests);
export default router;
