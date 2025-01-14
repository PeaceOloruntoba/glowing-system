import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // User who is making the order
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // The product being purchased
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensure that the quantity is at least 1
        },
        price: {
          type: Number,
          required: true, // Price per unit of the product
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Total price of the order
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "delivered"],
      default: "pending",
    },
    paymentReference: {
      type: String, // Reference from Paystack for the transaction
    },
  },
  {
    timestamps: true, // To track when the order was created or updated
  }
);

export default mongoose.model("Order", OrderSchema);
