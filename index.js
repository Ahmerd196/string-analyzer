// index.js
import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Temporary in-memory storage
let strings = [];

// 🏠 Root route
app.get("/", (req, res) => {
  res.send("🚀 String Analyzer API is running! Use /strings to interact with the API.");
});

// 🧮 Add a string to analyze
app.post("/strings", (req, res) => {
  const { value } = req.body;

  if (!value || typeof value !== "string") {
    return res.status(400).json({ error: "Please provide a valid string in the 'value' field." });
  }

  // Analyze the string
  const analysis = {
    value,
    length: value.length,
    uppercase: value.toUpperCase(),
    lowercase: value.toLowerCase(),
    reversed: value.split("").reverse().join(""),
    vowelCount: (value.match(/[aeiou]/gi) || []).length,
  };

  strings.push(analysis);
  res.status(201).json({ message: "String added successfully!", analysis });
});

// 📋 Get all analyzed strings
app.get("/strings", (req, res) => {
  res.json(strings);
});

// 🔍 Get one string by its value
app.get("/strings/:value", (req, res) => {
  const { value } = req.params;
  const found = strings.find((s) => s.value === value);

  if (!found) {
    return res.status(404).json({ error: "String not found." });
  }

  res.json(found);
});

// 🗑️ Delete a string by its value
app.delete("/strings/:value", (req, res) => {
  const { value } = req.params;
  const index = strings.findIndex((s) => s.value === value);

  if (index === -1) {
    return res.status(404).json({ error: "String not found." });
  }

  strings.splice(index, 1);
  res.json({ message: "String deleted successfully!" });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
