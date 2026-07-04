import { Router } from "express";
import {
  guestHealthCareProfessional,
  createHealthCareProfessional,
  loginHealthCareProfessional,
  logoutHealthCareProfessional,
  getCurrentHealthCareProfessional,
  updateCurrentHealthCareProfessional,
  confirmEmail,
  resendOtp,
  forgotPasswordHealthCareProfessional,
  resetPasswordHealthCareProfessional,
  becomeRecruiter,
} from "../controllers/healthCareProfessionalController.js";
import {
  applyToJob,
  getMyApplications,
  getMyStats,
} from "../controllers/applicationController.js";
import {
  listNotifications,
  markNotificationRead,
} from "../controllers/notificationsController.js";
import {
  getJobSeekerConversations,
  sendMessageAsJobSeeker,
  getMessagesAsJobSeeker,
} from "../controllers/messageController.js";
import { authenticateHealthCareProfessional } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

// Guest HealthCareProfessional endpoint
router.get("/guest", guestHealthCareProfessional);

// Public auth for healthcare professionals
router.post("/register", upload.single('cv'), createHealthCareProfessional);
router.post("/login", loginHealthCareProfessional);
router.post("/logout", logoutHealthCareProfessional);
router.post("/confirm-email", confirmEmail);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPasswordHealthCareProfessional);
router.post("/reset-password", resetPasswordHealthCareProfessional);

// Self-only profile endpoints
router.get("/me", authenticateHealthCareProfessional, getCurrentHealthCareProfessional);
router.post("/become-recruiter", authenticateHealthCareProfessional, becomeRecruiter);
router.patch("/me", authenticateHealthCareProfessional, updateCurrentHealthCareProfessional);

// Applications & stats (self)
router.post("/apply/:jobId", authenticateHealthCareProfessional, applyToJob);
router.get("/applications", authenticateHealthCareProfessional, getMyApplications);
router.get("/stats", authenticateHealthCareProfessional, getMyStats);

// Notifications (self, unique)
router.get("/notifications", authenticateHealthCareProfessional, listNotifications);
router.patch(
  "/notifications/:id/read",
  authenticateHealthCareProfessional,
  markNotificationRead
);

// Messaging (self — only accepted applications)
router.get("/conversations", authenticateHealthCareProfessional, getJobSeekerConversations);
router.post("/messages/send", authenticateHealthCareProfessional, sendMessageAsJobSeeker);
router.get("/messages/:conversationId", authenticateHealthCareProfessional, getMessagesAsJobSeeker);

export default router;
