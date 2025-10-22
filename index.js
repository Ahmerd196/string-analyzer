// index.js
import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
let strings = []; // In-memory storage

// 🏠 Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 Welcome to String Analyzer API — use /strings to analyze strings!");
});

// 📘 Utility Functions
const analyzeString = (value) => {
  const clean = value.trim();
  const words = clean.split(/\s+/);
  const lower = clean.toLowerCase();

  const freqMap = {};
  for (let char of lower) {
    if (char !== " ") freqMap[char] = (freqMap[char] || 0) + 1;
  }

  const sha256 = crypto.createHash("sha256").update(value).digest("hex");

  return {
    id: sha256,
    value,
    properties: {
      length: value.length,
      is_palindrome: lower === lower.split("").reverse().join(""),
      unique_characters: new Set(lower.replace(/\s+/g, "")).size,
      word_count: words.length,
      sha256_hash: sha256,
      character_frequency_map: freqMap,
    },
    created_at: new Date().toISOString(),
  };
};

// 🧮 POST /strings — Analyze and store string
app.post("/strings", (req, res) => {
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: "Missing 'value' field" });
  if (typeof value !== "string") return res.status(422).json({ error: "'value' must be a string" });

  const existing = strings.find((s) => s.value === value);
  if (existing) return res.status(409).json({ error: "String already exists" });

  const analyzed = analyzeString(value);
  strings.push(analyzed);
  res.status(201).json(analyzed);
});

// 🔍 GET /strings/:string_value — Get a specific analyzed string
app.get("/strings/:string_value", (req, res) => {
  const { string_value } = req.params;
  const found = strings.find((s) => s.value === string_value);
  if (!found) return res.status(404).json({ error: "String not found" });
  res.json(found);
});

// 📋 GET /strings — Get all strings with filtering
app.get("/strings", (req, res) => {
  let results = [...strings];
  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

  if (is_palindrome !== undefined) {
    const boolVal = is_palindrome === "true";
    results = results.filter((s) => s.properties.is_palindrome === boolVal);
  }
  if (min_length) results = results.filter((s) => s.properties.length >= Number(min_length));
  if (max_length) results = results.filter((s) => s.properties.length <= Number(max_length));
  if (word_count) results = results.filter((s) => s.properties.word_count === Number(word_count));
  if (contains_character) {
    const ch = contains_character.toLowerCase();
    results = results.filter((s) => s.value.toLowerCase().includes(ch));
  }

  res.json({
    data: results,
    count: results.length,
    filters_applied: req.query,
  });
});

// 🧠 Natural language filter — GET /strings/filter-by-natural-language?query=...
app.get("/strings/filter-by-natural-language", (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing 'query' parameter" });

  const q = query.toLowerCase();
  let filters = {};

  if (q.includes("palindromic")) filters.is_palindrome = true;
  if (q.includes("single word")) filters.word_count = 1;
  if (q.includes("longer than")) {
    const num = parseInt(q.match(/\d+/));
    if (num) filters.min_length = num + 1;
  }
  if (q.includes("containing the letter")) {
    const char = q.split("letter")[1]?.trim()[0];
    if (char) filters.contains_character = char;
  } else if (q.includes("containing the first vowel")) {
    filters.contains_character = "a";
  }

  let filtered = [...strings];
  if (filters.is_palindrome) filtered = filtered.filter((s) => s.properties.is_palindrome);
  if (filters.word_count) filtered = filtered.filter((s) => s.properties.word_count === filters.word_count);
  if (filters.min_length) filtered = filtered.filter((s) => s.properties.length >= filters.min_length);
  if (filters.contains_character)
    filtered = filtered.filter((s) => s.value.toLowerCase().includes(filters.contains_character));

  if (!filtered.length)
    return res.status(400).json({ error: "Unable to parse or no matches found", interpreted_query: filters });

  res.json({
    data: filtered,
    count: filtered.length,
    interpreted_query: { original: query, parsed_filters: filters },
  });
});

// 🗑 DELETE /strings/:string_value — Delete a string
app.delete("/strings/:string_value", (req, res) => {
  const { string_value } = req.params;
  const index = strings.findIndex((s) => s.value === string_value);
  if (index === -1) return res.status(404).json({ error: "String not found" });
  strings.splice(index, 1);
  res.status(204).send();
});

// 🚀 Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
