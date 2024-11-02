import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },{ timestamps: true });
const adminModel = mongoose.model("admin", adminSchema);

export default adminModel;
