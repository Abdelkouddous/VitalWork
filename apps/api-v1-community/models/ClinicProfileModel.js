
import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema({
  _id : {
    type : String,
    // required : true,
    // unique : true,
    ref : "User"
  },
  name: {
    type: String,
    default: "name",
  },
  hospitalName : {
    type : String,
    default : 'hospitalName'
  },
  location: {
    type: String,
    default: "MyCity",
  },
  // avatar setup
  avatar: {
    type : String
  },
  avatarPublicId:{
    type : String
  },
  //
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined", "blocked"],
    default: "pending",
  },
  // Clinic posting controls
  trialJobsLimit: { type: Number, default: 3 },
  lifetimeJobOffersCreated: { type: Number, default: 0 },
  jobOffersQuota: { type: Number, default: 3 },
  plan: {
    type: String,
    enum: ["trial", "basic", "enterprise"],
    default: "trial",
  },
  quotaExpiresAt: { type: Date },
 
 
});


export default mongoose.model("ClinicProfile", ClinicSchema, "clinics");
