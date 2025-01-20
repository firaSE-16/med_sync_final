import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
      enum: ['Morning', 'Afternoon', 'Evening'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, 
  }
);


const Booking = mongoose.models.Booking|| mongoose.model('Booking', bookingSchema);
export default Booking;
