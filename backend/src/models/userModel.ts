import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    image:{
      type:String,
    }
  },{ timestamps: true });
const userModel = mongoose.model("user", userSchema);

export default userModel;
