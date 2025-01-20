import Triage from '../models/triage.model.js';
import User from '../models/user.model.js';
import OPD from '../models/opd.model.js';
import Booking from '../models/book.model.js';



// Controller for fetching bookings (patients) by triage nurse
export const fetchBookings = async (req, res) => {
  try {
    const triageId = req.user.id; // Assuming req.user contains authenticated user details
    const triage = await Triage.findById(triageId);

    if (!triage) {
      return res.status(404).json({ message: "Triage nurse not found" });
    }

    const bookings = await Booking.find().populate(
      "userId",
      "_id fullName email age city bloodType"
    );

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for assigning a patient to the correct OPD
export const assignBookingToOPD = async (req, res) => {
  try {
    const triageId = req.user.id; // Assuming req.user contains authenticated user details
    const { bookingId, opdName, pulseRate } = req.body;

    if (!bookingId || !opdName || !pulseRate) {
      return res.status(400).json({ message: "Booking ID, OPD name, and pulse rate are required" });
    }

    const triage = await Triage.findById(triageId);
    if (!triage) {
      return res.status(404).json({ message: "Triage nurse not found" });
    }

    const opd = await OPD.findOne({ name: opdName });
    if (!opd) {
      return res.status(404).json({ message: "OPD not found" });
    }

    const booking = await Booking.findById(bookingId).populate("userId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const patient = booking.userId;
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Assign the patient to the OPD and update pulse rate
    patient.opd = opd.name;
    patient.pulseRate = pulseRate;
    await patient.save();
    await OPD.findByIdAndUpdate(opd._id, { $push: { patients: patient._id } });

    // Remove the booking from the Booking model
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Patient assigned to OPD and booking removed successfully" });
  } catch (error) {
    console.error("Error in assignBookingToOPD:", error);
    res.status(500).json({ message: "Server error" });
  }
};
