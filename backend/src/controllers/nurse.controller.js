import Nurse from '../models/nurse.model.js';
import OPD from '../models/opd.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';

// Fetch patients assigned to a nurse's OPD
export const fetchPatients = async (req, res) => {
   
  try {
    const nurseId = req.user.id;
    const nurse = await Nurse.findById(nurseId);
    
    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }
    const opd = await OPD.findOne({ name: nurse.opd });
    
    if (!opd) {
      return res.status(404).json({ message: "OPD not found" });
    }

     
      const patients = await User.find({ opd: nurse.opd }).select('_id fullName email age city bloodType');
    res.status(200).json({ patients });
    
    

   

    
  } catch (error) {
    console.log(error);
    console.error("Error in fetchPatients:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all doctors in the nurse's OPD
export const fetchDoctors = async (req, res) => {
  try {
    const nurseId = req.user.id;
    const nurse = await Nurse.findById(nurseId);
    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const opd = await OPD.findOne({ name: nurse.opd });
    if (!opd) {
      return res.status(404).json({ message: "OPD not found" });
    }

  
    const doctors = await Doctor.find({ opd: nurse.opd }).select('_id fullName appointments');
   
    res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error in fetchDoctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch a specific doctor's appointments
export const fetchDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId).select('appointments');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ appointments: doctor.appointments });
  } catch (error) {
    console.error("Error in fetchDoctorAppointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign an appointment to a patient
export const assignAppointment = async (req, res) => {
  try {
    
    const nurseId = req.user.id;
    const { patientId, doctorId, date, time } = req.body;
    
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const nurse = await Nurse.findById(nurseId);
    
    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const opd = await OPD.findOne({ name: nurse.opd });
  
    if (!opd) {
      return res.status(404).json({ message: "OPD not found" });
    }

    const doctorExistsInOPD = opd.doctors.some((doc) => doc.doctorId.toString() === doctorId);
    console.log(doctorExistsInOPD)
    if (!doctorExistsInOPD) {
      return res.status(400).json({ message: "Doctor does not belong to the same OPD" });
    }

    const doctor = await Doctor.findById(doctorId);
   
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await User.findById(patientId);
    console.log(patient)
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Add appointment to the doctor's schedule
    const newAppointment = {
      patientId,
      patientName: patient.fullName,
      date: new Date(date),
      time,
      status: "Pending",
    };
    

    doctor.appointments.push(newAppointment);
    await doctor.save();

    
      await Appointment.create({
        patientId,
        doctorId,
        opd: nurse.opd,
        date: new Date(date),
        time,
        status: "Pending",
      });
  
     
    
    res.status(200).json({ message: "Appointment assigned successfully" });
  } catch (error) {
   
    console.error("Error in assignAppointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
