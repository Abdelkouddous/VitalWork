import Message from "../models/MessageModel.js";
import Conversation from "../models/ConversationModel.js";
import Application from "../models/ApplicationModel.js";

// Maps lowercase role strings from req.user.role to Mongoose enum values
const normalizeRole = (role) => {
  const map = {
    employer: "ClinicProfile",
    clinic: "ClinicProfile",
    jobseeker: "HealthCareProfessionalProfile",
    healthcareprofessional: "HealthCareProfessionalProfile"
  };
  return map[role?.toLowerCase()] || role;
};

export const sendMessage = async (req, res) => {
  try {
    const {content, receiverId, receiverModel, jobId} = req.body;
    const senderId = req.user.userId;
    const senderModel = normalizeRole(req.user.role);
    const normalizedReceiverModel = normalizeRole(receiverModel);
    let conversation = await Conversation.findOne({
      $or: [
        { employerId: senderId, jobId: jobId },
        { jobSeekerId: senderId, jobId: jobId },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        // employerId / jobSeekerId are the ConversationModel field names (kept for DB compat)
        employerId: senderModel === "ClinicProfile" ? senderId : receiverId,
        jobSeekerId: senderModel === "HealthCareProfessionalProfile" ? senderId : receiverId,
        jobId: jobId,
      });
    }
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      senderModel: senderModel,
      receiver: receiverId,
      receiverModel: normalizedReceiverModel,
      content: content,
    });
    await conversation.save();

    await message.populate("sender");
    await message.populate("receiver");

    res.status(201).json({ msg: "Message sent successfully!", message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export const getConversation = async (req, res) => {
  try {
    const {jobId} = req.params;
    const senderId = req.user.userId;
    const senderModel = req.user.role;
    let conversation = await Conversation.findOne({
      $or: [
        { employerId: senderId, jobId: jobId },
        { jobSeekerId: senderId, jobId: jobId },
      ],
    });
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    res.status(200).json({ conversation });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  } 

}

export const getMessages = async (req, res) => {
  try {
    const {conversationId} = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    
    // Tenancy isolation check: Ensure the requesting user is a participant
    if (conversation.employerId !== req.user.userId && conversation.jobSeekerId !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized to access this conversation" });
    }
    
    // Fetch and populate messages directly from the collection
    const messages = await Message.find({ conversationId })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: 1 });
      
    res.status(200).json({ messages });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

// ─── Healthcare Professional Messaging Endpoints ───────────────────────────────────────────

/**
 * Get all conversations for the authenticated Healthcare Professional.
 * Only returns conversations where the linked application is "accepted".
 */
export const getJobSeekerConversations = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional?.healthCareProfessionalId;

    // Find all accepted applications for this healthcare professional
    const acceptedApps = await Application.find({
      healthCareProfessional: healthCareProfessionalId,
      status: "accepted",
    }).select("job");
    const acceptedJobIds = acceptedApps.map((a) => a.job);

    // Find conversations that match this healthCareProfessional AND an accepted job
    const conversations = await Conversation.find({
      jobSeekerId: healthCareProfessionalId,
      jobId: { $in: acceptedJobIds },
    })
      .populate("employerId", "name lastName email avatar")
      .populate("jobId", "position company")
      .sort({ updatedAt: -1 });

    // Attach last message preview to each conversation
    const results = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .select("content createdAt senderModel");
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiver: healthCareProfessionalId,
          read: false,
        });
        return {
          ...conv.toObject(),
          lastMessage: lastMsg || null,
          unreadCount,
        };
      })
    );

    res.status(200).json({ conversations: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Send a message as a Healthcare Professional.
 * If no conversation exists yet, one is created (only if application is accepted).
 */
export const sendMessageAsJobSeeker = async (req, res) => {
  try {
    // Use the property set by authenticateHealthCareProfessional middleware
    const healthCareProfessionalId = req.healthCareProfessional.healthCareProfessionalId;
    const { content, receiverId, jobId } = req.body;

    // Verify the application is accepted before allowing chat
    // ApplicationModel field is `healthCareProfessional`, not `jobSeeker`
    const application = await Application.findOne({
      job: jobId,
      healthCareProfessional: healthCareProfessionalId,
      status: "accepted",
    });
    if (!application) {
      return res
        .status(403)
        .json({ msg: "You can only message clinics who accepted your application" });
    }

    let conversation = await Conversation.findOne({
      jobSeekerId: healthCareProfessionalId,
      jobId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        employerId: receiverId,
        jobSeekerId: healthCareProfessionalId,
        jobId,
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: healthCareProfessionalId,
      senderModel: "HealthCareProfessionalProfile", // must match MessageModel enum
      receiver: receiverId,
      receiverModel: "ClinicProfile",               // must match MessageModel enum
      content,
    });

    conversation.updatedAt = new Date();
    await conversation.save();
    await message.populate("sender");
    await message.populate("receiver");

    res.status(201).json({ msg: "Message sent successfully!", message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Get messages for a specific conversation as a Healthcare Professional.
 * Verifies the Healthcare Professional is a participant and marks messages as read.
 */
export const getMessagesAsJobSeeker = async (req, res) => {
  try {
    const healthCareProfessionalId = req.healthCareProfessional.healthCareProfessionalId;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    if (conversation.jobSeekerId.toString() !== healthCareProfessionalId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Mark all incoming messages as read
    await Message.updateMany(
      { conversationId, receiver: healthCareProfessionalId, read: false },
      { read: true }
    );

    const messages = await Message.find({ conversationId })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

