// models/PopupEmail.js
import mongoose from "mongoose";

const popupEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  subscribe: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PopupEmail", popupEmailSchema);
