import { Router } from "express";
// Description: Handles routing for clinic-related operations
import {
  getCurrentUser,
  getAllHealthCareProfessionals,
  getAllClinics,
  getUserJobs,
  updateUser,
  validateUpdateUserInput,
} from "../controllers/clinicController.js";
import { getClinicApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { getClinicAppStats } from "../controllers/applicationController.js";
import upload from "../middleware/multerMiddleware.js";

//This is clinics router
// All routes in this router are protected by the authorizePermissions middleware

const router = Router();


router.get("/all-seekers", getAllHealthCareProfessionals);
router.get("/current-user", getCurrentUser);
router.get("/my-jobs", getUserJobs);
router.get("/my-applications", getClinicApplications);
router.patch("/applications/:id/status", updateApplicationStatus);
router.get("/app-stats", getClinicAppStats);
router.patch(
  "/update-user",
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);


export default router;
