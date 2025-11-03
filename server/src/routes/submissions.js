const express = require("express");
const router = express.Router();
const {
  submitCode,
  getUserSubmissions,
  getPendingSubmissions,
  reviewSubmission,
  getAllSubmissions,
} = require("../controllers/submissionController");
const { authenticate, isAdmin } = require("../middleware/auth");

// User routes
router.post("/submit", authenticate, submitCode);
router.get("/my-submissions", authenticate, getUserSubmissions);

// Admin routes
router.get("/pending", authenticate, isAdmin, getPendingSubmissions);
router.get("/all", authenticate, isAdmin, getAllSubmissions);
router.put("/review/:submissionId", authenticate, isAdmin, reviewSubmission);

module.exports = router;

