import { StatusCodes } from "http-status-codes";
import Application from "../models/ApplicationModel.js";
import Notification from "../models/NotificationModel.js";
import Job from "../models/JobModel.js";
import mongoose from "mongoose";

// deterministic placeholder score: stable per (job, jobSeeker)
const calcCompatibility = (jobId, jobSeekerId) => {
  const str = `${jobId}${jobSeekerId}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
  }
  return hash % 101; // 0..100
};

export const applyToJob = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    const role = req.healthCareProfessional?.role;
    const { jobId } = req.params;

    // Block guests or invalid ids from applying
    if (role === "healthcareprofessional_guest" || !healthCareProfessionalId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Please login as a healthcare professional to apply" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
    }

    // Avoid duplicates
    const existing = await Application.findOne({ job: jobId, healthCareProfessional: healthCareProfessionalId }).populate("job");
    if (existing) {
      return res.status(StatusCodes.OK).json({ application: existing, alreadyApplied: true });
    }

    const score = calcCompatibility(jobId, healthCareProfessionalId);

    const application = await Application.create({
      job: jobId,
      healthCareProfessional: healthCareProfessionalId,
      status: "applied",
      compatibilityScore: score,
    });

    // Create a single 'applied' notification
    await Notification.create({
      recipientHealthCareProfessional: healthCareProfessionalId,
      type: "applied",
      message: `Application submitted for ${job.position} at ${job.company}`,
    });

    res.status(StatusCodes.CREATED).json({ application: await application.populate("job") });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    const role = req.healthCareProfessional?.role;

    // Guests or invalid ids get empty list instead of 500
    if (role === "healthcareprofessional_guest" || !healthCareProfessionalId) {
      return res.status(StatusCodes.OK).json({ applications: [] });
    }

    const applications = await Application.find({ healthCareProfessional: healthCareProfessionalId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ applications });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getMyStats = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    const role = req.healthCareProfessional?.role;

    // Guests or invalid ids get zeroed stats instead of 500
    if (role === "healthcareprofessional_guest" || !healthCareProfessionalId) {
      return res.status(StatusCodes.OK).json({
        counts: { applied: 0, viewed: 0, accepted: 0, rejected: 0, interview: 0 },
        total: 0,
        applications: 0,
        interviews: 0,
        profileViews: 0,
        avgCompatibility: 0,
        matchRate: "0%",
      });
    }

    const apps = await Application.find({ healthCareProfessional: healthCareProfessionalId });

    const counts = { applied: 0, viewed: 0, accepted: 0, rejected: 0, interview: 0 };
    let totalCompatibility = 0;
    if (apps.length > 0) {
      for (const a of apps) {
        counts[a.status] = (counts[a.status] || 0) + 1;
        totalCompatibility += a.compatibilityScore || 0;
      }
    }
    const avgCompatibility = apps.length > 0 ? Math.round(totalCompatibility / apps.length) : 0;
    const totalApplications = apps.length;
    const interviews = (counts.accepted || 0) + (counts.interview || 0);
    const profileViews = counts.viewed || 0;
    const matchRate = avgCompatibility > 0 ? `${avgCompatibility}%` : (totalApplications > 0 ? "88%" : "0%");

    res.status(StatusCodes.OK).json({
      counts,
      total: totalApplications,
      applications: totalApplications,
      interviews,
      profileViews,
      avgCompatibility,
      matchRate,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const listNotifications = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    const role = req.healthCareProfessional?.role;

    if (role === "healthcareprofessional_guest" || !healthCareProfessionalId) {
      return res.status(StatusCodes.OK).json({ notifications: [] });
    }

    // Unique notifications for this healthcare professional (using UUID string)
    const notifications = await Notification.aggregate([
      { $match: { recipientHealthCareProfessional: healthCareProfessionalId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { type: "$type", message: "$message" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
    ]);

    res.status(StatusCodes.OK).json({ notifications });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    const role = req.healthCareProfessional?.role;
    const { id } = req.params;

    if (role === "healthcareprofessional_guest" || !healthCareProfessionalId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Please login as a healthcare professional" });
    }

    const notif = await Notification.findOneAndUpdate(
      { _id: id, recipientHealthCareProfessional: healthCareProfessionalId },
      { read: true },
      { new: true }
    );
    if (!notif) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Notification not found" });
    }
    res.status(StatusCodes.OK).json({ notification: notif });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getClinicApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find all jobs created by this clinic
    const jobs = await Job.find({ createdBy: userId });
    const jobIds = jobs.map((job) => job._id);

    // Find applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job")
      .populate("healthCareProfessional")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ applications });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["applied", "viewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const application = await Application.findById(id).populate("job");
    if (!application) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Application not found" });
    }

    // Verify the clinic owns the job this application belongs to
    const job = await Job.findById(application.job._id);
    if (!job || job.createdBy.toString() !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    // Send notification to the healthcare professional
    await Notification.create({
      recipientHealthCareProfessional: application.healthCareProfessional,
      type: status,
      message: `Your application for ${job.position} at ${job.company} has been ${status}`,
    });

    const updated = await Application.findById(id)
      .populate("job")
      .populate("healthCareProfessional");

    res.status(StatusCodes.OK).json({ application: updated });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getClinicAppStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find all jobs created by this clinic
    const jobs = await Job.find({ createdBy: userId });
    const jobIds = jobs.map((job) => job._id);

    const stats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const defaultStats = {
      applied: stats.find((item) => item._id === "applied")?.count || 0,
      viewed: stats.find((item) => item._id === "viewed")?.count || 0,
      accepted: stats.find((item) => item._id === "accepted")?.count || 0,
      rejected: stats.find((item) => item._id === "rejected")?.count || 0,
    };

    const totalApplications =
      defaultStats.applied +
      defaultStats.viewed +
      defaultStats.accepted +
      defaultStats.rejected;

    res.status(StatusCodes.OK).json({
      defaultStats,
      totalApplications,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

