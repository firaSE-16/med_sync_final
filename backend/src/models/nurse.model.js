import mongoose from 'mongoose'

const nurseSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "nurse",
    },
    
  },
  { timestamps: true }
);

const Nurse = mongoose.models.Nurse || mongoose.model('Nurse', nurseSchema);

export default Nurse