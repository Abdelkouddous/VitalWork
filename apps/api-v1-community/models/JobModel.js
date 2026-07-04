import mongoose from "mongoose";
import { JOB_TYPE } from "../utils/constants.js";
import { JOB_STATUS, MEDICAL_SPECIALIZATION } from "../utils/constants.js";

const JobSchema = new mongoose.Schema(
  {
    // example : Expert Pneumologist
    position: {
      type: String,
    },
    company: {
      type: String,
      default : "Company Name"
    },
    jobLocation: {
      type: String,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    salaryRange: {
      type :
      {
        min_cents : Number,
        max_cents : Number
      },
      default : {
        min_cents : 2000000,
      }

    },
    // med spec
    specialization: {
      type: String,
      enum: Object.values(MEDICAL_SPECIALIZATION),
      default: MEDICAL_SPECIALIZATION.GENERAL,
    },
    applicationDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
