import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: '',
    },
    nationality: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    fatherName: {
      type: String,
      default: '',
    },
    motherName: {
      type: String,
      default: "",
    },
    moneyOwed: {
      type: Number,
      default: 0,
    },
    emergencyContact: {
      name: { type: String, default: "" },
      relationship: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    bloodType: {
      type: String,
      default: "",
    },
    allergies: [
      {
        type: String,
      },
    ],
    prescriptions: [
      {
        doctorName: { type: String, required: true },
        details: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    medicalHistory: [
      {
        condition: { type: String, required: true },
        treatment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    opd: {
      type: String,
      default: "",
    },
    pulseRate: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
    },
    labRequests: [
      {
        requestType: { type: String, required: true },  // Type of lab request, e.g., 'blood test'
        dateRequested: { type: Date, default: Date.now },  // Date when the request was made
        requestedBy: { type: String, required: true },  // Who made the request (e.g., doctor)
        status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }, // Status of the lab request
        details: { type: String, default: "" },  // Additional details about the lab request
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
