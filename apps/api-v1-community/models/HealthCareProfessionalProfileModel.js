import mongoose from "mongoose";
import { MEDICAL_SPECIALIZATION } from "../utils/constants.js";


const HealthCareProfessionalSchema = new mongoose.Schema({
  _id :{
    type : String,
    // required : true,
    // unique : true,
    ref : "User"},
 
  // plan logic
  plan : {
    type : String,
    enum : {
      values : [ "standard", "premium"],
      message : "{VALUE} is not a supported subscription tier "},
    default : "standard",
    index: true // Optimized for performance lookup on tier-based filtering
  },
  // Metadata tracking to support the enum logic
  planExpiresAt: {
    type: Date,
    default: null
  },
  // Other specific fields
   name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last (family) name"],
    trim: true,
  },
  specialization: {
    type: String,
    enum: Object.values(MEDICAL_SPECIALIZATION),
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  experience: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  languages: {
    type: [String],
    default: [],
  },
  curriculumVitae: {
    type: String, // URL to stored PDF file
    // made optional for MVP registration
    required: false,
  },
  activeCV: {
    type: String,
    enum: ["uploaded", "generated"],
    default: "generated", // Default implies they have a template automatically available
  },
  location: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String, // URL to stored image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  
});


// Instance Method: Clean abstraction for authorization guards in controllers
HealthCareProfessionalSchema.methods.hasPremiumAccess = function () {
  if (this.plan==='standard') return false;
  // Guard clause for expired premium sub
  if (this.planExpiresAt && Date.now() > this.planExpiresAt){
    return false;
  }
  return true;
}

const HealthCareProfessionalModel = mongoose.model("HealthCareProfessionalProfile", HealthCareProfessionalSchema, "healthcareprofessionals");
export default HealthCareProfessionalModel;
