const express = require("express");
const { signup, signin } = require("../controllers/authController");

const router = express.Router();

// Add this test route
router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "Auth routes are working!" });
});

router.post("/signup", (req, res, next) => {
  console.log("Signup route hit with body:", req.body);
  signup(req, res, next);
});

router.post("/signin", (req, res, next) => {
  console.log("Signin route hit with body:", req.body);
  signin(req, res, next);
});

module.exports = router;


