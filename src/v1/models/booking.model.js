import mongoose from "mongoose";

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: [String],
      enum: [
        "pending",
        "ongoing",
        "paid",
        "packaged",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      default: ["pending"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", BookingSchema);
