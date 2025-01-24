import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Update totalPrice and totalAmount before saving
cartSchema.pre("save", async function (next) {
  let totalAmount = 0;

  for (const item of this.items) {
    const product = await mongoose.model("Product").findById(item.productId);
    if (product) {
      item.totalPrice = product.ourPrice * item.quantity;
      totalAmount += item.totalPrice;
    }
  }

  this.totalAmount = totalAmount;
  next();
});

export default mongoose.model("Cart", cartSchema);
