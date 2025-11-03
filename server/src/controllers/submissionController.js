const CodeSubmission = require("../models/CodeSubmission");
const User = require("../models/User");

// Submit code
const submitCode = async (req, res) => {
  try {
    const { title, description, code, language, category } = req.body;
    const userId = req.userId; // Assuming middleware sets this from JWT

    if (!title || !description || !code || !language || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const submission = new CodeSubmission({
      title,
      description,
      code,
      language,
      category,
      submittedBy: userId,
    });

    await submission.save();
    res.status(201).json({ message: "Code submitted successfully", submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all submissions for a user
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.userId;
    const submissions = await CodeSubmission.find({ submittedBy: userId })
      .sort({ submittedAt: -1 })
      .populate("submittedBy", "name email");

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pending submissions (admin only)
const getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await CodeSubmission.find({ status: "pending" })
      .sort({ submittedAt: -1 })
      .populate("submittedBy", "name email");

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Review submission (approve/reject) - admin only
const reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, reviewNotes } = req.body;
    const reviewerId = req.userId;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const submission = await CodeSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.status = status;
    submission.reviewedBy = reviewerId;
    submission.reviewNotes = reviewNotes || "";
    submission.reviewedAt = new Date();

    await submission.save();
    res.status(200).json({ message: "Submission reviewed successfully", submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all submissions (admin only)
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await CodeSubmission.find()
      .sort({ submittedAt: -1 })
      .populate("submittedBy", "name email")
      .populate("reviewedBy", "name email");

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitCode,
  getUserSubmissions,
  getPendingSubmissions,
  reviewSubmission,
  getAllSubmissions,
};

