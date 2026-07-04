import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipientHealthCareProfessional: {
      type: String,
      ref: "HealthCareProfessionalProfile",
      required: true,
    },
    type: {
      type: String,
      enum: ["applied", "seen", "accepted", "rejected"],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;