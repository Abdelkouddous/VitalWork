import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender:{
      type: String,
      required: true,
      refPath:"senderModel"
    },
    senderModel:{
      type : String,
      enum: ["ClinicProfile", "HealthCareProfessionalProfile"],
      required: true,
    },
    receiver:{
      type: String,
      required: true,
      refPath:"receiverModel"
    },
    receiverModel:{
      type : String,
      enum: ["ClinicProfile", "HealthCareProfessionalProfile"],
      required: true,
    },
    content:{
      type: String,
      required: true,
    },
    read:{
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);