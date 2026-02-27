import mongoose from "mongoose";

const wholesaleSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    businessType: { type: String, required: true },
    location: { type: String, required: true },
    weeklyUsage: { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true },
);

const WholesaleInquiry = mongoose.model("WholesaleInquiry", wholesaleSchema);

export default WholesaleInquiry;
