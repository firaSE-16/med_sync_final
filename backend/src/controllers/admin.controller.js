import Doctor from "../models/doctor.model.js";
import Nurse from "../models/nurse.model.js";
import Triage from "../models/triage.model.js";
import Laboratorist from "../models/labratorist.model.js";
import upload from '../lib/multer.js'; // Import your multer configuration
import path from 'path';
import bcrypt from 'bcrypt';
import OPD from '../models/opd.model.js';
// Helper function for handling errors
const handleError = (res, error) => res.status(500).json({ error: error.message });



export const addStaff = async (req, res) => {
  upload.single('profilePic')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Image upload failed', details: err.message });
    }
    console.log(req.body);

    try {
      const { role, opd, password, ...newStaffData } = req.body;

      let Model;

      switch (role) {
        case 'doctor':
          Model = Doctor;
          break;
        case 'nurse':
          Model = Nurse;
          break;
        case 'laboratorist': // Add case for laboratorist
          Model = Laboratorist;
          break;
        case 'triage': // Add case for triage
          Model = Triage;
          break;
        default:
          return res.status(400).json({ error: 'Invalid role specified.' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      newStaffData.password = hashedPassword;
      newStaffData.opd = opd;

      if (req.file) {
        newStaffData.profilePic = req.file.path;
      }

      // Save the staff data
      const newStaff = new Model(newStaffData);

      const savedStaff = await newStaff.save();

      // Add staff to the appropriate OPD field for doctors/nurses
      if (role === 'doctor' || role === 'nurse') {
        if (opd) {
          const updateField = role === 'doctor' ? 'doctors' : 'nurses';
          await OPD.findOneAndUpdate(
            { name: opd },
            { $push: { [updateField]: { [`${role}Id`]: savedStaff._id } } },
          );
        }
      }

      res.status(201).json({
        message: 'Staff added successfully!',
        staff: savedStaff,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add staff', details: error.message });
    }
  });
};





// Update existing staff (with image upload)
export const updateStaff = async (req, res) => {
  const { role, id } = req.params;

  let Model;
  switch (role) {
    case 'doctor':
      Model = Doctor;
      break;
    case 'nurse':
      Model = Nurse;
      break;
    case 'triage':
      Model = Triage;
      break;
    case 'laboratorist':
      Model = Laboratorist;
      break;
    default:
      return res.status(400).json({ error: 'Invalid role specified.' });
  }

  // Handle image upload using multer
  upload.single('profilePic')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Image upload failed', details: err.message });
    }

    try {
      const updatedStaffData = req.body;

      // Check if file is uploaded
      if (req.file) {
        // Construct the file path to store in the database
        updatedStaffData.profilePic = path.join('uploads', 'profiles', req.file.filename); // Save file path in DB
      }

      const updatedStaff = await Model.findByIdAndUpdate(id, updatedStaffData, { new: true });
      if (!updatedStaff) return res.status(404).json({ error: 'Staff member not found.' });
      res.json(updatedStaff);
    } catch (error) {
      handleError(res, error);
    }
  });
};

// Delete staff member
export const deleteStaff = async (req, res) => {
  const { role, id } = req.params;

  let Model;
  switch (role) {
    case 'doctor':
      Model = Doctor;
      break;
    case 'nurse':
      Model = Nurse;
      break;
    case 'triage':
      Model = Triage;
      break;
    case 'laboratorist':
      Model = Laboratorist;
      break;
    default:
      return res.status(400).json({ error: 'Invalid role specified.' });
  }

  try {
    const deletedStaff = await Model.findByIdAndDelete(id);
    if (!deletedStaff) return res.status(404).json({ error: 'Staff member not found.' });
    res.json({ message: 'Staff member deleted successfully.' });
  } catch (error) {
    handleError(res, error);
  }
};

// Fetch all staff of a particular role
export const fetchAllStaff = async (req, res) => {
  const { role } = req.params;

  let Model;
  switch (role) {
    case 'doctor':
      Model = Doctor;
      break;
    case 'nurse':
      Model = Nurse;
      break;
    case 'triage':
      Model = Triage;
      break;
    case 'laboratorist':
      Model = Laboratorist;
      break;
    default:
      return res.status(400).json({ error: 'Invalid role specified.' });
  }

  try {
    const staff = await Model.find();
    res.json(staff);
  } catch (error) {
    handleError(res, error);
  }
};
