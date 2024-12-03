import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    category: {
      type: Number,
      required: true,
      default: [],
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: String,
      required: true,
      default: [],
    },
    coverImage: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      required: true,
    },
    location: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
