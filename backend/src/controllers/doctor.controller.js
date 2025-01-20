// Import necessary modules and models
import User from '../models/user.model.js'; // Adjust the path based on your folder structure
import LabRequest from '../models/lab.model.js';
import Appointment from '../models/appointment.model.js'; // Adjust the path based on your folder structure

export const getAppointment = async (req, res) => {
  
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's information
    const { role } = req.user; // Assuming roles like "patient", "doctor", etc., exist in your system

    let filter = {};

    if (role === 'patient') {
      filter.patientId = userId;
    } else if (role === 'doctor') {
      filter.doctorId = userId;
    } else {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'fullName email') 
      .populate('doctorId', 'fullName specialization') 
      .sort({ date: 1, time: 1 }); 
      console.log(appointments)

    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found.' });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Fetch complete patient data, including profile picture and related records
// Fetch complete patient data, including profile picture and related records
// Updated controller to populate appointments
export const getPatientData = async (req, res) => {
  const userId = req.user.id; // Get the logged-in doctor's user ID from the session/token
  const { patientId } = req.params;  // Fetch `patientId` from the URL parameter

  try {
    const patient = await User.findById(patientId)
   
      .populate('prescriptions') // You can populate other fields like prescriptions if necessary
      .populate('medicalHistory') // Populate medical history
      .populate('labRequests'); // Populate lab requests

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).json({ error: error.message });
  }
};



export const addPrescription = async (req, res) => {
  const { patientId, doctorName, details } = req.body;

  try {
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    patient.prescriptions.push({
      doctorName,
      details,
      date: new Date(),
    });

    await patient.save();

    res.status(201).json({ message: 'Prescription added successfully.', patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new medical history record
export const addMedicalHistory = async (req, res) => {
  const { patientId, condition, treatment } = req.body;

  try {
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    patient.medicalHistory.push({
      condition,
      treatment,
      date: new Date(),
    });

    await patient.save();

    res.status(201).json({ message: 'Medical history added successfully.', patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch prescriptions for a patient
export const getPrescriptions = async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    res.status(200).json({ prescriptions: patient.prescriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch medical history for a patient
export const getMedicalHistory = async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    res.status(200).json({ medicalHistory: patient.medicalHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add a lab request for a patient
export const addLabRequest = async (req, res) => {
  const { patientId, testType, notes } = req.body;

  try {
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    const newLabRequest = new LabRequest({
      patientId,
      testType,
      notes,
    });

    await newLabRequest.save();

    res.status(201).json({ message: 'Lab request added successfully.', newLabRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch lab results for a patient
export const getLabResults = async (req, res) => {
  const { patientId } = req.params;

  try {
    const labRequests = await LabRequest.find({ patientId });
    if (!labRequests.length) return res.status(404).json({ error: 'No lab requests found for this patient.' });

    res.status(200).json({ labRequests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
