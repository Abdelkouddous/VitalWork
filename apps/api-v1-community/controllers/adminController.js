import { StatusCodes } from "http-status-codes";
import ClinicProfile from "../models/ClinicProfileModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import { createJWT } from "../utils/tokenUtils.js";

// Admin: Dedicated login for platform owner
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    // Must be platform owner
    const rawAdminEmails = process.env.ADMIN_EMAIL || "abdelkouddoushamel@vitalwork.dz,admin@vitalwork.dz";
    const allowedAdminEmails = rawAdminEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const isAuthorizedAdmin =
      user.role === "admin" &&
      (allowedAdminEmails.includes(user.email.toLowerCase()) ||
        user.email.toLowerCase() === "abdelkouddoushamel@vitalwork.dz" ||
        user.email.toLowerCase() === "admin@vitalwork.dz");

    if (!isAuthorizedAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied. Not an administrator." });
    }

    const token = createJWT({ userId: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.status(StatusCodes.OK).json({
      message: "Admin logged in successfully",
      user: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// getting stats necessary for admin dashboard stats
export const getApplicationStats = async (req, res) => {
  const userId = req.user.userId;
  try {
    const jobs = await Job.find({ createdBy: userId });
    const totalJobs = await Job.countDocuments();
    const appliedJobs = jobs.filter((job) => job.applied).length;
    const pendingJobs = totalJobs - appliedJobs;
    const totalUsers = await ClinicProfile.countDocuments();

    res.status(StatusCodes.OK).json({
      totalJobs,
      appliedJobs,
      pendingJobs,
      totalUsers,
      msg: "Successfully got application stats",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// Admin: Approve or block clinics
export const updateClinicStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["approved", "pending", "blocked"];
    if (!validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid status. Must be approved, pending, or blocked",
      });
    }

    const user = await ClinicProfile.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Clinic not found" });
    }

    res.status(StatusCodes.OK).json({
      msg: `Clinic status updated to ${status}`,
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// Admin: Update clinic quotas
export const updateClinicQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobOffersQuota, plan, quotaExpiresAt } = req.body;

    if (jobOffersQuota && jobOffersQuota < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Quota cannot be negative",
      });
    }

    const updateData = {};
    if (jobOffersQuota !== undefined)
      updateData.jobOffersQuota = jobOffersQuota;
    if (plan) updateData.plan = plan;
    if (quotaExpiresAt) updateData.quotaExpiresAt = quotaExpiresAt;

    const user = await ClinicProfile.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Clinic not found" });
    }

    res.status(StatusCodes.OK).json({
      msg: "Clinic quota updated",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

// List pending clinics for admin review
export const getPendingClinics = async (req, res) => {
  try {
    const pendingUsers = await ClinicProfile.find({
      status: "pending",
    });

    res.status(StatusCodes.OK).json({
      users: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
