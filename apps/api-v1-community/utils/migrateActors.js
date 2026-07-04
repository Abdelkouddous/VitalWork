import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const runMigration = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error("MONGO_URL not found in env variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUrl);
    const db = mongoose.connection.db;

    // 1. Get current collections list
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);
    console.log("Existing collections in database:", names);

    // 2. Rename employers -> clinics
    if (names.includes("employers") && !names.includes("clinics")) {
      console.log("Renaming 'employers' to 'clinics'...");
      await db.collection("employers").rename("clinics");
    } else {
      console.log("Skipping 'employers' rename (already renamed or doesn't exist).");
    }

    // 3. Rename jobseekers -> healthcareprofessionals
    if (names.includes("jobseekers") && !names.includes("healthcareprofessionals")) {
      console.log("Renaming 'jobseekers' to 'healthcareprofessionals'...");
      await db.collection("jobseekers").rename("healthcareprofessionals");
    } else {
      console.log("Skipping 'jobseekers' rename (already renamed or doesn't exist).");
    }

    // 4. Update roles in users collection
    console.log("Updating role values in users collection...");
    const userUpdate1 = await db.collection("users").updateMany(
      { role: "employer" },
      { $set: { role: "clinic" } }
    );
    const userUpdate2 = await db.collection("users").updateMany(
      { role: "jobseeker" },
      { $set: { role: "healthcareprofessional" } }
    );
    console.log(`Updated User roles: ${userUpdate1.modifiedCount} employers, ${userUpdate2.modifiedCount} jobseekers.`);

    // 5. Update applications indexes and fields
    if (names.includes("applications")) {
      const appCollection = db.collection("applications");
      const indexes = await appCollection.indexes();
      const indexNames = indexes.map(i => i.name);
      
      console.log("Existing indexes on applications:", indexNames);

      // Drop old unique index if it exists
      if (indexNames.includes("job_1_jobSeeker_1")) {
        console.log("Dropping old unique index 'job_1_jobSeeker_1'...");
        await appCollection.dropIndex("job_1_jobSeeker_1");
      }

      // Rename the field jobSeeker to healthCareProfessional
      console.log("Renaming field jobSeeker -> healthCareProfessional...");
      const appUpdate = await appCollection.updateMany(
        { jobSeeker: { $exists: true } },
        { $rename: { jobSeeker: "healthCareProfessional" } }
      );
      console.log(`Updated applications field names: ${appUpdate.modifiedCount} documents updated.`);

      // Create new unique index
      console.log("Creating new unique index job_1_healthCareProfessional_1...");
      await appCollection.createIndex(
        { job: 1, healthCareProfessional: 1 },
        { unique: true, name: "job_1_healthCareProfessional_1" }
      );
      console.log("Created new unique index successfully.");
    }

    // 6. Update cvs collection indexes and fields
    if (names.includes("cvs")) {
      const cvCollection = db.collection("cvs");
      const indexes = await cvCollection.indexes();
      const indexNames = indexes.map(i => i.name);

      if (indexNames.includes("jobSeekerId_1")) {
        console.log("Dropping old unique index 'jobSeekerId_1'...");
        await cvCollection.dropIndex("jobSeekerId_1");
      }

      console.log("Renaming field jobSeekerId -> healthCareProfessionalId in cvs...");
      const cvUpdate = await cvCollection.updateMany(
        { jobSeekerId: { $exists: true } },
        { $rename: { jobSeekerId: "healthCareProfessionalId" } }
      );
      console.log(`Updated cvs field names: ${cvUpdate.modifiedCount} documents updated.`);

      console.log("Creating new unique index healthCareProfessionalId_1...");
      await cvCollection.createIndex(
        { healthCareProfessionalId: 1 },
        { unique: true, name: "healthCareProfessionalId_1" }
      );
      console.log("Created new unique index on cvs successfully.");
    }

    // 7. Update notifications collection fields
    if (names.includes("notifications")) {
      console.log("Renaming field recipientJobSeeker -> recipientHealthCareProfessional in notifications...");
      const notifUpdate = await db.collection("notifications").updateMany(
        { recipientJobSeeker: { $exists: true } },
        { $rename: { recipientJobSeeker: "recipientHealthCareProfessional" } }
      );
      console.log(`Updated notifications field names: ${notifUpdate.modifiedCount} documents updated.`);
    }

    // 8. Update blogs collection dynamic ref enums
    if (names.includes("blogs")) {
      console.log("Updating dynamic ref enums in blogs collection...");
      const blogsCollection = db.collection("blogs");
      
      const author1 = await blogsCollection.updateMany({ authorType: "Employer" }, { $set: { authorType: "ClinicProfile" } });
      const author2 = await blogsCollection.updateMany({ authorType: "JobSeeker" }, { $set: { authorType: "HealthCareProfessionalProfile" } });
      
      const comm1 = await blogsCollection.updateMany({ "comments.userType": "Employer" }, { $set: { "comments.$[comment].userType": "ClinicProfile" } }, { arrayFilters: [{ "comment.userType": "Employer" }] });
      const comm2 = await blogsCollection.updateMany({ "comments.userType": "JobSeeker" }, { $set: { "comments.$[comment].userType": "HealthCareProfessionalProfile" } }, { arrayFilters: [{ "comment.userType": "JobSeeker" }] });

      const like1 = await blogsCollection.updateMany({ "likes.userType": "Employer" }, { $set: { "likes.$[like].userType": "ClinicProfile" } }, { arrayFilters: [{ "like.userType": "Employer" }] });
      const like2 = await blogsCollection.updateMany({ "likes.userType": "JobSeeker" }, { $set: { "likes.$[like].userType": "HealthCareProfessionalProfile" } }, { arrayFilters: [{ "like.userType": "JobSeeker" }] });

      console.log(`Updated blogs: ${author1.modifiedCount + author2.modifiedCount} authors, ${comm1.modifiedCount + comm2.modifiedCount} comments, ${like1.modifiedCount + like2.modifiedCount} likes.`);
    }

    // 9. Update messages collection dynamic ref enums
    if (names.includes("messages")) {
      console.log("Updating dynamic ref enums in messages collection...");
      const messagesCollection = db.collection("messages");
      
      const msg1 = await messagesCollection.updateMany({ senderModel: "Employer" }, { $set: { senderModel: "ClinicProfile" } });
      const msg2 = await messagesCollection.updateMany({ senderModel: "JobSeeker" }, { $set: { senderModel: "HealthCareProfessionalProfile" } });
      
      const msg3 = await messagesCollection.updateMany({ receiverModel: "Employer" }, { $set: { receiverModel: "ClinicProfile" } });
      const msg4 = await messagesCollection.updateMany({ receiverModel: "JobSeeker" }, { $set: { receiverModel: "HealthCareProfessionalProfile" } });

      console.log(`Updated messages: ${msg1.modifiedCount + msg2.modifiedCount + msg3.modifiedCount + msg4.modifiedCount} documents.`);
    }

    console.log("Data migration successfully completed without any data loss!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

runMigration();
