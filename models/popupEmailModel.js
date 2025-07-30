import mongoose from "mongoose";

const popupEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    subscribe: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PopupEmail = mongoose.model("PopupEmail", popupEmailSchema);
export default PopupEmail;
