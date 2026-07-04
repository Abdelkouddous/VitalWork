// This is admin router
import { Router } from "express";
const router = Router();
import { getCEOAnalytics } from "../controllers/adminAnalyticsController.js";
import { authenticateUser, authenticatePlatformOwner, authorizePermissions } from "../middleware/authMiddleware.js";
import {
  loginAdmin,
  updateClinicStatus,
  updateClinicQuota,
  getPendingClinics,
  getApplicationStats,
} from "../controllers/adminController.js";
import {
  getAllClinics,
} from "../controllers/clinicController.js";

// Public Admin Login
router.post("/login", loginAdmin);

// Protect all subsequent routes
router.use(authenticateUser);

// Admin: CEO Analytics Dashboard — guarded by the TWO-FACTOR platform owner check.
// authorizePermissions("admin") alone is NOT sufficient; the user's email must
// also match the ADMIN_EMAIL env variable. No employer can access this.

router.get("/ceo-analytics", [
  authenticatePlatformOwner,
  getCEOAnalytics,
]);

// Admin: list pending clinics
router.get("/clinics/pending", [
  authorizePermissions("admin"),
  getPendingClinics,
]);

// Admin: approve/block clinic
router.patch("/clinics/:id/status", [
  authorizePermissions("admin"),
  updateClinicStatus,
]);

// Admin: update clinic quota
router.patch("/clinics/:id/quota", [
  authorizePermissions("admin"),
  updateClinicQuota,
]);

// Admin: get global application stats
router.get("/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);

router.get("/clinics", [
  authorizePermissions("admin"),
  getAllClinics,
]);

export default router;