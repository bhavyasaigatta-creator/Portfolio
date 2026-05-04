const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Project = require("./models/Project");

const app = express();

// CORS
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ---------------- ROUTES ----------------

// GET all projects
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST project
app.post("/projects", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.json({ message: "Project saved to DB" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
app.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted from DB" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE project
app.put("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- MONGODB ----------------

// ❗ FIXED (removed old options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});