import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, 
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'Cash', 'Online Payment', 'Insurance'],
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now, 
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending', 
    },
    serviceType: {
      type: String,
      enum: ['Consultation', 'Lab Test', 'Surgery', 'Medication', 'Other'],
      required: true,
    },
    referenceNumber: {
      type: String,
      unique: true,
      required: true, 
    },
   
  },
  { timestamps: true }
);

const PaymentTransaction = mongoose.models.PaymentTransaction`` ||mongoose.model('PaymentTransaction', paymentTransactionSchema);

export default PaymentTransaction;
