import mongoose from 'mongoose';
const doctorSchema = new mongoose.Schema(
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
    specialization: {
      type: String,
      default: "",
    },
 
    experience: {
      type: Number, 
      default: 0,
    },
    contactNumber: {
      type: String,
      default: "",
    },
   
    opd: {
      type: String,
      default: "",
    },
  
    patients: [
      {
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
    appointments: [
      {
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        time: { type: String, default: "" },
        status: {
          type: String,
          enum: ["Pending", "Completed", "Cancelled"],
          default: "Pending",
        },
      },
    ],
    role:{
      type:String,
      default:"doctor"
    },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

const Doctor = mongoose.models.Doctor|| mongoose.model('Doctor', doctorSchema);
export default Doctor;