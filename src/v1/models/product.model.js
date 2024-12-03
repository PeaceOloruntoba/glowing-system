import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OTP", otpSchema);
