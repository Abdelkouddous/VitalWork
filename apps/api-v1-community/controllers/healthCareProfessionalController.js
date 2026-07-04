import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import HealthCareProfessionalProfile from "../models/HealthCareProfessionalProfileModel.js";
import ClinicProfile from "../models/ClinicProfileModel.js";
import { createJWT } from "../utils/tokenUtils.js";
import mongoose from "mongoose";
import CV from "../models/CVModel.js";

// Get healthcare professional by ID
export const getHealthCareProfessionalById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Healthcare professional not found" });
    }
    const profile = await HealthCareProfessionalProfile.findById(req.params.id);
    res.status(StatusCodes.OK).json({ ...user.toObject(), ...profile?.toObject() });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Create new healthcare professional (Registration)
export const createHealthCareProfessional = async (req, res) => {
  try {
    const { email, password, name, lastName, specialization, location, phoneNumber } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide email and password" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 1. Create authentication credentials
    const user = await User.create({
      email,
      password,
      role: "healthcareprofessional",
      isConfirmed: false,
      confirmOTP: otp,
      otpExpires,
    });

    // 2. Create the associated profile document (SRP)
    const profile = await HealthCareProfessionalProfile.create({
      _id: user._id,
      name: name || "First Name",
      lastName: lastName || "Last Name",
      specialization : specialization || "General Practitioner",
      location,
      phoneNumber,
    });

    console.log(`[DEV] OTP for ${email}: ${otp}`);
    const responseData = {
      message: `OTP : ${otp}`,
      userId: user._id,
    };

    if (process.env.NODE_ENV === "development") {
      responseData.devOtp = otp;
    }

    // Save CV if uploaded
    if (req.file) {
      await CV.create({
        healthCareProfessionalId: user._id,
        cvType: "uploaded",
        cvUrl: `/uploads/${req.file.filename}`,
        cvPublicId: req.file.filename,
        originalFileName: req.file.originalname,
      });
      profile.curriculumVitae = `/uploads/${req.file.filename}`;
      await profile.save();
    }

    res.status(StatusCodes.CREATED).json(responseData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Confirm email
export const confirmEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId).select("+confirmOTP +otpExpires");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (user.isConfirmed) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already confirmed" });
    }

    if (user.confirmOTP !== otp || Date.now() > user.otpExpires) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired OTP" });
    }

    user.isConfirmed = true;
    user.confirmOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Email confirmed successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.confirmOTP = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log(`[DEV] New OTP for ${user.email}: ${otp}`);
    res.status(StatusCodes.OK).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Login
export const loginHealthCareProfessional = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    if (!user.isConfirmed) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Please confirm your email first",
        userId: user._id,
        isConfirmed: false,
      });
    }

    const profile = await HealthCareProfessionalProfile.findById(user._id);
    const token = createJWT({ healthCareProfessionalId: user._id, userId: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    const loginData = { ...user.toJSON(), ...profile?.toJSON() };
    res.status(StatusCodes.OK).json({
      message: "Logged in successfully",
      user: loginData,
      jobSeeker: loginData,
      healthcareProfessional: loginData,
      token,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Logout
export const logoutHealthCareProfessional = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
};

// Guest registration
export const guestHealthCareProfessional = async (req, res) => {
  try {
    const guestUser = {
      _id: "guest-id",
      name: "Guest User",
      role: "guest",
      email: "guest@example.com",
    };
    res.status(StatusCodes.OK).json({ user: guestUser });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get current healthcare professional profile
export const getCurrentHealthCareProfessional = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    if (!healthCareProfessionalId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication invalid" });
    }
    const user = await User.findById(healthCareProfessionalId);
    const profile = await HealthCareProfessionalProfile.findById(healthCareProfessionalId);
    const hcpData = { ...user?.toObject(), ...profile?.toObject() };
    res.status(StatusCodes.OK).json({
      jobSeeker: hcpData,
      healthcareProfessional: hcpData,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Update current healthcare professional profile
export const updateCurrentHealthCareProfessional = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    if (!healthCareProfessionalId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication invalid" });
    }

    const updates = { ...req.body, updatedAt: new Date() };

    // Separate credential updates from profile updates (SRP)
    if (updates.password) {
      const user = await User.findById(healthCareProfessionalId).select("+password");
      user.password = updates.password;
      await user.save();
    }
    if (updates.email) {
      await User.findByIdAndUpdate(healthCareProfessionalId, { email: updates.email });
    }

    const updatedProfile = await HealthCareProfessionalProfile.findByIdAndUpdate(
      healthCareProfessionalId,
      { $set: updates },
      { new: true }
    );

    const user = await User.findById(healthCareProfessionalId);
    const hcpData = { ...user?.toJSON(), ...updatedProfile?.toJSON() };
    res.status(StatusCodes.OK).json({
      jobSeeker: hcpData,
      healthcareProfessional: hcpData,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Forgot Password
export const forgotPasswordHealthCareProfessional = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    // SECURITY-06 fix: Always return 200 — never confirm whether an account exists.
    // Community-tier: if user found, show the OTP directly for testing convenience.
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
      user.resetPasswordOTP = hashedOTP;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      console.log(`[DEV] Reset OTP for ${email}: ${otp}`);
      return res.status(StatusCodes.OK).json({
        message: "Reset OTP sent successfully",
        devOtp: otp, // Community tier: OTP intentionally exposed for testing
      });
    }

    // No account found — return the same 200 shape to prevent enumeration
    res.status(StatusCodes.OK).json({
      message: "If an account exists with that email, a reset OTP has been sent",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Reset Password
export const resetPasswordHealthCareProfessional = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    // Hash the candidate OTP to compare against the stored hash (SECURITY-04)
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordOTP: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Become Recruiter (Convert to Clinic)
export const becomeRecruiter = async (req, res) => {
  const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findById(healthCareProfessionalId).session(session);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    user.role = "clinic";
    await user.save({ session });

    // Remove HealthCareProfessionalProfile and create ClinicProfile
    await HealthCareProfessionalProfile.findByIdAndDelete(healthCareProfessionalId).session(session);
    await ClinicProfile.create([{
      _id: healthCareProfessionalId,
      name: user.email.split("@")[0],
      hospitalName: "My Hospital",
      location: "Algiers",
      status: "approved",
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json({ message: "Role converted to Clinic successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
