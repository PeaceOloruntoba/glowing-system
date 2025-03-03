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
    designerId: {
      type: Schema.Types.ObjectId,
      ref: "DesignerProfile",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "ongoing",
        "paid",
        "packaged",
        "out for delivery",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: ["pending"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    price: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", BookingSchema);
