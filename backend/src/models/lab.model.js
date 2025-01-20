import mongoose from "mongoose";
const { Schema } = mongoose;

const labRequestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    testType: {
      type: String,
      required: true,
      enum: ['Blood Test', 'X-Ray', 'MRI', 'Urine Test', 'Other'], 
    },
    status: {
      type: String,
      enum: ['Pending','Inprogress', 'Completed'],
      default: 'Pending', 
    },
    results: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      maxlength: 500, 
    },
  },
  {
    timestamps: true, 
  }
);

const LabRequest = mongoose.models.LabRequest|| mongoose.model('LabRequest', labRequestSchema);

export default LabRequest;
