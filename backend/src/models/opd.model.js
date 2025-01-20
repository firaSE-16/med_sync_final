import mongoose from 'mongoose';

const opdSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    patients: [
      {
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
       
      },
    ],
    doctors: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
       
      },
    ],
    nurses: [
      {
        nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
      },
    ],
    
  },
  { timestamps: true }
);


const OPD = mongoose.models.OPD || mongoose.model('OPD', opdSchema);

export default OPD
