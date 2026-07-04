import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// we will migrate Employer, JobSeeker, Admin to this single User schema
const userSchema = new mongoose.Schema({
    // 1. Sharding & Scalability Guard: Overriding _id with a UUID
    _id : {
      type : String,
      default : () => crypto.randomUUID(),
    },
    // 2. Authentication & Identity Core
    email : {
      type : String,
      required: [true, "Please provide an email"],
      validate: {
        validator: function (email) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        },
        message: "Please provide a valid email address",
      
    },
      unique : true,
      lowercase : true,
      trim : true,
    },
    password : {
      type : String,
      required: [true, "Please provide a password"],
      minlength : [8 , "Minimum 8 characters password"],
      select : false,
    },
    role : {
      type : String,
      enum : ["clinic" , "admin" , "healthcareprofessional"],
      required : [true, "please specify a role"]
    },
    isConfirmed : {
      type : Boolean,
      default : false,
    },
    createdAt : {
    type : Date,
    default : Date.now
    },
    confirmOTP: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    resetPasswordOTP: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
});


userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

/**
 * 3.Pre-save Middleware Hook
 * Hashes the password automatically before saving to MongoDB
 */
userSchema.pre('save', async function (next){
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    // hash password using salt
    this.password = await bcrypt.hash(this.password , salt);
    next();
  }
  catch (error){
    next(error);
  }

}
)

/**
 * 4. Instance Method for Password Verification
 * Used in login controller: user.correctPassword(candidatePassword, user.password)
 */

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return bcrypt.compare(candidatePassword , this.password)

}



export default mongoose.model("User", userSchema);
