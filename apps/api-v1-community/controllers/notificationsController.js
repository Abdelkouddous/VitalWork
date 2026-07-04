import { StatusCodes } from "http-status-codes";
import Notification from "../models/NotificationModel.js";
// List notifications for the authenticated healthcare professional
export const listNotifications = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    const role = req.healthCareProfessional?.role;
    if (role === "healthcareprofessional_guest" || !healthCareProfessionalId) {
      return res.status(StatusCodes.OK).json({ notifications: [] });
    }
    // Fixed type-casting bug: query string UUID directly without mongoose.Types.ObjectId()
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
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
// Mark a single notification as read
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
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};