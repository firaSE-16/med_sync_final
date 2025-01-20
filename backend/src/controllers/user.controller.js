import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import Booking from '../models/book.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import Nurse from "../models/nurse.model.js";
import Triage from "../models/triage.model.js";
import Laboratorist from "../models/labratorist.model.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../lib/utils.js";
import path from 'path'; 
import  upload  from '../lib/multer.js'; // Ensure multer's upload configuration is correctly imported
import Appointment from '../models/appointment.model.js';
const handleError = (res, error) => res.status(500).json({ error: error.message });



export const completeUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { age, nationality, city, fatherName, motherName, emergencyContact, bloodType } = req.body;

  // Check if a profile picture was uploaded
  let profilePicUrl = null;
  if (req.file) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'user_profiles', // Optional: Store images in a specific folder on Cloudinary
      });
      profilePicUrl = result.secure_url; // This URL will be saved in the user's profile
    } catch (error) {
      return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
    }
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    user.age = age;
    user.nationality = nationality;
    user.city = city;
    user.fatherName = fatherName;
    user.motherName = motherName;
    user.emergencyContact = emergencyContact;
    user.bloodType = bloodType;

    // Only update profilePic if the user uploaded a new one
    if (profilePicUrl) {
      user.profilePic = profilePicUrl;
    }

    await user.save();

    res.status(200).json({ message: 'Profile completed successfully', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};



export const updateUserProfile = async (req, res) => {
  console.log('Request Body:', req.body); // Debugging
  console.log('Request File:', req.file); // Debugging

  const userId = req.user.id;

  const {
    age,
    nationality,
    city,
    fatherName,
    motherName,
    bloodType,
    'emergencyContact.name': emergencyContactName,
    'emergencyContact.relationship': emergencyContactRelationship,
    'emergencyContact.phone': emergencyContactPhone,
  } = req.body;

  // Reconstruct `emergencyContact` object
  const emergencyContact = {
    name: emergencyContactName,
    relationship: emergencyContactRelationship,
    phone: emergencyContactPhone,
  };

  // Validate required fields
  if (
    !age ||
    !nationality ||
    !city ||
    !fatherName ||
    !motherName ||
    !bloodType ||
    !emergencyContact.name ||
    !emergencyContact.relationship ||
    !emergencyContact.phone
  ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        public_id: `profile_${userId}`,
        overwrite: true,
      });
      user.profilePic = uploadResponse.secure_url;
    }

    user.age = age;
    user.nationality = nationality;
    user.city = city;
    user.fatherName = fatherName;
    user.motherName = motherName;
    user.bloodType = bloodType;
    user.emergencyContact = emergencyContact; // Update emergency contact

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




export const getUserProfile = async (req, res) => {
    try{
        res.status(200).json(req.user)
      }catch(error){
        console.log("Error in chekAuth controller",error.message)
      }
};

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
  
    try {
       if(!password||!email||!fullName){
            return res.status(400).json({ message: "Please provide all required fields" });
       }
  
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 chaeacters" });
      }
  
      const user = await User.findOne({ email });
  
      if (user) {
        res.status(400).json({ message: "Email already exist" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      if (newUser) {
        generateToken(newUser._id,newUser.role, res);
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
    }
  };


  export const bookAppointment = async (req, res) => {
    const userId = req.user.id; 
  
    const { appointmentDate, appointmentTime } = req.body;
  
    try {
    
      if (!appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
      }
  

      const newBooking = new Booking({
        userId,
        appointmentDate,
        appointmentTime,
        status: 'Pending', 
      });
  

      const savedBooking = await newBooking.save();
  
      res.status(201).json({
        message: 'Appointment booked successfully.',
        booking: savedBooking,
      });
    } catch (error) {
      console.error('Error in bookAppointment:', error.message);
      res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
  };



export const fetchAppointment = async (req, res) => {
  try {
    // Get the logged-in user's ID
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's information

    // Find all appointments for the given user ID
    const appointments = await Booking.find({ userId })
      .populate("userId", "fullName email") // Populates user details (optional)
      .sort({ appointmentDate: 1, appointmentTime: 1 }); // Sorts by date and time

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    // Send the appointments to the frontend
    res.status(200).json({
      message: "Appointments fetched successfully.",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ error: "An error occurred while fetching appointments." });
  }
};

export const fetchAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is available
    const appointment = await Appointment.find({ patientId: userId })
      .populate("doctorId", "name specialty") // Populate doctor details
      .sort({ date: 1, time: 1 }); // Sort appointments

    if (!appointment.length) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json({
      message: "Appointments fetched successfully.",
      appointment,
    });
  } catch (error) {
    console.log(error);
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ error: "An error occurred while fetching appointments." });
  }
};
