import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    employerId:{
      type: String,
      ref: "ClinicProfile",
      required: true,
    },
    jobSeekerId:{
      type: String,
      ref: "HealthCareProfessionalProfile",
      required: true,
    },
    messages:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    jobId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);