import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    designerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ourPrice: {
      type: Number,
      default: 0,
    },
    productCategoryId: {
      type: Number,
      required: true,
      default: 1,
      enum: [1, 2, 3, 4],
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    coverImage: {
      type: [String],
      required: true,
      default: [],
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
      type: String,
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

productSchema.pre("save", function (next) {
  this.ourPrice = this.price + this.price * 0.12;
  next();
});

productSchema.pre("save", function (next) {
  this.discountPrice = this.ourPrice - this.discount;
  next();
});

export default mongoose.model("Product", productSchema);
