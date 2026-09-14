import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/UserModel.js";
import ClinicProfile from "./models/ClinicProfileModel.js";
import HealthCareProfessionalProfile from "./models/HealthCareProfessionalProfileModel.js";

export async function seedDemoAccounts() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL);
    }
    console.log("Connected to MongoDB Atlas for Demo Accounts seeding...");

    // 1. ADMIN ACCOUNTS
    const adminEmails = ["abdelkouddoushamel@vitalwork.dz", "admin@vitalwork.dz"];
    for (const email of adminEmails) {
      let user = await User.findOne({ email }).select("+password");
      if (!user) {
        user = new User({
          email,
          password: "password123",
          role: "admin",
          isConfirmed: true,
        });
        await user.save();
        console.log(`Created admin user: ${email} (${user._id})`);
      } else {
        const matches = await user.correctPassword("password123", user.password);
        if (!matches || !user.isConfirmed || user.role !== "admin") {
          user.password = "password123";
          user.role = "admin";
          user.isConfirmed = true;
          await user.save();
          console.log(`Updated admin user: ${email} (${user._id})`);
        }
      }

      await ClinicProfile.findByIdAndUpdate(
        user._id,
        {
          name: "Abdelkouddous",
          hospitalName: "VitalWork Headquarters",
          location: "Algiers",
          status: "approved",
        },
        { upsert: true, new: true }
      );
    }

    // 2. CLINIC ACCOUNTS
    const clinicEmails = ["clinic@vitalwork.dz", "employer1@vitalwork.dz"];
    for (const email of clinicEmails) {
      let user = await User.findOne({ email }).select("+password");
      if (!user) {
        user = new User({
          email,
          password: "password123",
          role: "clinic",
          isConfirmed: true,
        });
        await user.save();
        console.log(`Created clinic user: ${email} (${user._id})`);
      } else {
        const matches = await user.correctPassword("password123", user.password);
        if (!matches || !user.isConfirmed || user.role !== "clinic") {
          user.password = "password123";
          user.role = "clinic";
          user.isConfirmed = true;
          await user.save();
          console.log(`Updated clinic user: ${email} (${user._id})`);
        }
      }

      await ClinicProfile.findByIdAndUpdate(
        user._id,
        {
          name: "Dr. Mustapha Bensalah",
          hospitalName: "Clinique El Azhar",
          location: "Algiers",
          status: "approved",
        },
        { upsert: true, new: true }
      );
    }

    // 3. HEALTHCARE PROFESSIONAL ACCOUNTS
    const doctorEmails = ["doctor@vitalwork.dz", "seeker1@vitalwork.dz"];
    for (const email of doctorEmails) {
      let user = await User.findOne({ email }).select("+password");
      if (!user) {
        user = new User({
          email,
          password: "password123",
          role: "healthcareprofessional",
          isConfirmed: true,
        });
        await user.save();
        console.log(`Created doctor user: ${email} (${user._id})`);
      } else {
        const matches = await user.correctPassword("password123", user.password);
        if (!matches || !user.isConfirmed || user.role !== "healthcareprofessional") {
          user.password = "password123";
          user.role = "healthcareprofessional";
          user.isConfirmed = true;
          await user.save();
          console.log(`Updated doctor user: ${email} (${user._id})`);
        }
      }

      await HealthCareProfessionalProfile.findByIdAndUpdate(
        user._id,
        {
          name: "Dr. Amina",
          lastName: "Bouzid",
          specialization: "Cardiologist",
          location: "Algiers",
          phoneNumber: "+213555123456",
          bio: "Cardiologue clinicienne au CHU Mustapha Pacha, diplômée de la Faculté de Médecine d'Alger.",
          experience: "7 ans d'expérience clinique",
          education: "Doctorat en Médecine - Université d'Alger",
          skills: ["Auscultation", "ECG Reading", "Cardiology"],
          languages: ["Arabic", "French", "English"],
        },
        { upsert: true, new: true }
      );
    }

    console.log("All demo accounts verified and synchronized in database!");
    return true;
  } catch (error) {
    console.error("Error seeding demo accounts:", error);
    throw error;
  }
}

if (process.argv[1] && process.argv[1].endsWith("seedDemoAccounts.js")) {
  seedDemoAccounts()
    .then(() => {
      console.log("Seeding process finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed with error:", err);
      process.exit(1);
    });
}
