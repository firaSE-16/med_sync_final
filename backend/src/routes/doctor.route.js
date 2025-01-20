import express from 'express';
import { addPrescription, addMedicalHistory, getMedicalHistory, getPrescriptions, addLabRequest, getLabResults, getPatientData, getAppointment } from '../controllers/doctor.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'; // Optional: For authorization middleware

const router = express.Router();
router.get('/getAppointment/',protectRoute,getAppointment)
router.get('/getPatientData/:patientId',protectRoute, getPatientData)
router.post('/addPrescription', protectRoute, addPrescription);


router.post('/addMedicalHistory', protectRoute, addMedicalHistory);

router.get('/getPrescriptions', protectRoute, getPrescriptions);

router.get('/getMedicalHistory', protectRoute, getMedicalHistory
);
router.post('/addLabRequest', protectRoute, addLabRequest);


router.get('/getLabResults/:patientId', protectRoute, getLabResults);


export default router;
