// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const GeoData = require("./models/geoData");

dotenv.config();

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL
// Database connection
mongoose.connect(MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// User registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send("User registered");
});

// User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign({ userId: user._id }, "secretkey");
  res.json({ token });
});

// GeoData upload
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  // Handle file upload
  const file = req.file;
  const geoData = new GeoData({ userId: req.user.userId, filePath: file.path });
  geoData.save();
  res.status(201).send("File uploaded");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
