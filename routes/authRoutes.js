const express = require("express");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are necessary" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: await user.getJWT(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating user", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are necessary" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (await user.comparePassword(password)) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send({token,user});
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
});

router.get("/getUser", protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

router.post("/upload", protect, upload.single("image"), async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    user.profileImageUrl = imageUrl;
    await user.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
      user, 
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error uploading image", error: err.message });
  }
});

module.exports = router;
