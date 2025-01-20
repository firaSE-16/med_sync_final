import mongoose from 'mongoose'

const triageSchema = new mongoose.Schema(
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
        required: true, 
      },
    role: {
      type: String,
      default: "triage",
    },
    
  },
  { timestamps: true }
);


const Triage = mongoose.models.Triage || mongoose.model("Triage", triageSchema);
export default Triage