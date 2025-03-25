import mongoose from "mongoose";

const { Schema } = mongoose;

const DesignerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: [true, "Please provide a business name"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [
        /^(0)(7|8|9){1}(0|1){1}[0-9]{8}$/,
        "Please enter a valid Nigerian phone number",
      ],
    },
    yearsOfExperience: {
      type: String,
      required: [true, "Please provide your years of experience."],
    },
    businessAddress: {
      type: String,
      required: [true, "Please provide a business address."],
    },
    state: {
      type: String,
      required: [true, "Please select the state your business is located in."],
    },
    bank: {
      type: String,
      required: [true, "Please provide a bank name."],
    },
    accountNumber: {
      type: String,
      required: [true, "Please provide an account number"],
      match: [/^\d{10}$/, "Please provide a valid account number"],
    },
    socialMedia: {
      type: String,
      required: [true, "Please provide a verifiable social media link"],
    },
    cacRegNo: {
      type: String,
      required: [true, "Please provide a valid CAC Reg No"],
    },
    subscriptionPlan: {
      type: String,
      enum: ["monthly", "biannual", "annual"],
      default: null,
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    subActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DesignerProfile", DesignerProfileSchema);
