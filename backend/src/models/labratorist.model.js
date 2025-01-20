import mongoose from 'mongoose'

const laboratoristSchema = new mongoose.Schema(
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
      default: "laboratorist",
    },
    
  },
  { timestamps: true }
);

const Laboratorist = mongoose.models.Laboratorist || mongoose.model('Laboratorist', laboratoristSchema);
export default Laboratorist