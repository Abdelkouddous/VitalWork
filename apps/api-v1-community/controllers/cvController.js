import CV from "../models/CVModel.js";
import HealthCareProfessionalProfile from "../models/HealthCareProfessionalProfileModel.js";
import { StatusCodes } from "http-status-codes";

export const uploadCV = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;
    if (!healthCareProfessionalId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "No CV file provided" });
    }

    const { filename, mimetype, size, originalname } = req.file;
    const fileUrl = `/uploads/${filename}`;

    // Safely Upsert the CV Document
    const cv = await CV.findOneAndUpdate(
      { healthCareProfessionalId: healthCareProfessionalId },
      {
        healthCareProfessionalId: healthCareProfessionalId,
        cvType: "uploaded",
        cvUrl: fileUrl,
        cvPublicId: filename,
        originalFileName: originalname,
      },
      { new: true, upsert: true }
    );

    // Sync the URL tightly with the HealthCareProfessional profile
    await HealthCareProfessionalProfile.findByIdAndUpdate(healthCareProfessionalId, {
      curriculumVitae: fileUrl,
    });

    res.status(StatusCodes.OK).json({ msg: "CV uploaded successfully", cv });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
