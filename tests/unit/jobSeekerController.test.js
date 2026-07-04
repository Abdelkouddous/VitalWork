import "express-async-errors";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import healthCareProfessionalRouter from "../../apps/api-v1-community/routes/healthCareProfessionalRouter.js";
import User from "../../apps/api-v1-community/models/UserModel.js";
import HealthCareProfessionalProfile from "../../apps/api-v1-community/models/HealthCareProfessionalProfileModel.js";
import ClinicProfile from "../../apps/api-v1-community/models/ClinicProfileModel.js";
import { testUsers } from "../fixtures/testData.js";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "../../apps/api-v1-community/middleware/errorHandlerMiddleware.js";

// Create test app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/healthcare-professionals", healthCareProfessionalRouter);
app.use(errorHandlerMiddleware);

describe("Healthcare Professional Controller", () => {
  describe("POST /api/v1/healthcare-professionals/register", () => {
    it("should register a new Healthcare Professional successfully", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      expect(response.body.message).toContain("OTP :");
      expect(response.body.userId).toBeDefined();
    });

    it("should hash password before saving", async () => {
      await request(app)
        .post("/api/v1/healthcare-professionals/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      const user = await User.findOne({ email: testUsers.jobSeeker.email }).select("+password");
      expect(user.password).not.toBe(testUsers.jobSeeker.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it("should return error for duplicate email", async () => {
      // Register first user
      await request(app)
        .post("/api/v1/healthcare-professionals/register")
        .send(testUsers.jobSeeker)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/register")
        .send(testUsers.jobSeeker)
        .expect(400);

      expect(response.body.message).toBe("User already exists");
    });

    it("should return error for missing email or password", async () => {
      const incompleteUser = {
        name: "Dr. Johnson",
      };

      const response = await request(app)
        .post("/api/v1/healthcare-professionals/register")
        .send(incompleteUser)
        .expect(400);

      expect(response.body.message).toBe("Please provide email and password");
    });
  });

  describe("POST /api/v1/healthcare-professionals/login", () => {
    beforeEach(async () => {
      // Register a user and confirm their email before each login test
      const res = await request(app).post("/api/v1/healthcare-professionals/register").send(testUsers.jobSeeker);
      await User.findByIdAndUpdate(res.body.userId, { isConfirmed: true });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        })
        .expect(200);

      expect(response.body.healthcareProfessional.email).toBe(testUsers.jobSeeker.email);
      expect(response.body.token).toBeDefined();
    });

    it("should set httpOnly cookie on successful login", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        })
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).toContain("token=");
      expect(cookie).toContain("HttpOnly");
    });

    it("should return error for invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({
          email: "nonexistent@example.com",
          password: testUsers.jobSeeker.password,
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for invalid password", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for missing credentials", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({})
        .expect(400);

      expect(response.body.message).toBe("Please provide email and password");
    });
  });

  describe("POST /api/v1/healthcare-professionals/forgot-password", () => {
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/healthcare-professionals/register").send(testUsers.jobSeeker);
      await User.findByIdAndUpdate(res.body.userId, { isConfirmed: true });
    });

    it("should request reset OTP and return OTP in development", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const response = await request(app)
        .post("/api/v1/healthcare-professionals/forgot-password")
        .send({ email: testUsers.jobSeeker.email })
        .expect(200);

      expect(response.body.message).toContain("Reset OTP sent successfully");
      expect(response.body.devOtp).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it("should return the same success message even if email is not registered", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/forgot-password")
        .send({ email: "unregistered@example.com" })
        .expect(200);

      expect(response.body.message).toContain("a reset OTP has been sent");
      expect(response.body.devOtp).toBeUndefined();
    });
  });

  describe("POST /api/v1/healthcare-professionals/reset-password", () => {
    let devOtp;
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/healthcare-professionals/register").send(testUsers.jobSeeker);
      await User.findByIdAndUpdate(res.body.userId, { isConfirmed: true });
      
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const response = await request(app)
        .post("/api/v1/healthcare-professionals/forgot-password")
        .send({ email: testUsers.jobSeeker.email });
      
      devOtp = response.body.devOtp;
      process.env.NODE_ENV = originalEnv;
    });

    it("should reset password successfully with valid OTP", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/reset-password")
        .send({
          email: testUsers.jobSeeker.email,
          otp: devOtp,
          newPassword: "brandNewPassword123"
        })
        .expect(200);

      expect(response.body.message).toBe("Password reset successfully");

      // Verify login works with the new password
      await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: "brandNewPassword123"
        })
        .expect(200);
    });

    it("should reject invalid OTP", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/reset-password")
        .send({
          email: testUsers.jobSeeker.email,
          otp: "wrongOTP",
          newPassword: "brandNewPassword123"
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid or expired OTP");
    });
  });

  describe("POST /api/v1/healthcare-professionals/become-recruiter", () => {
    let tokenCookie;
    let userId;
    beforeEach(async () => {
      const res = await request(app).post("/api/v1/healthcare-professionals/register").send(testUsers.jobSeeker);
      userId = res.body.userId;
      await User.findByIdAndUpdate(userId, { isConfirmed: true });

      const loginRes = await request(app)
        .post("/api/v1/healthcare-professionals/login")
        .send({
          email: testUsers.jobSeeker.email,
          password: testUsers.jobSeeker.password,
        });
      tokenCookie = loginRes.headers["set-cookie"];
    });

    it("should successfully transition a Healthcare Professional to a clinic recruiter", async () => {
      const response = await request(app)
        .post("/api/v1/healthcare-professionals/become-recruiter")
        .set("Cookie", tokenCookie)
        .expect(200);

      expect(response.body.message).toBe("Role converted to Clinic successfully");
      
      const dbUser = await User.findById(userId);
      expect(dbUser.role).toBe("clinic");
    });

    it("should fail if not authenticated", async () => {
      await request(app)
        .post("/api/v1/healthcare-professionals/become-recruiter")
        .expect(401);
    });
  });
});
