import mongoose from "mongoose";
const { Schema } = mongoose;

const measurementSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const clientSchema = new Schema(
  {
    designerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    measurements: {
      type: [measurementSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Measurements must include at least one object.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client", clientSchema);
