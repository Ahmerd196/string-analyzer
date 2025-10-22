# 🚀 String Analyzer API (Backend Wizards Stage 1)

A RESTful API that analyzes strings and stores computed properties such as length, palindrome status, unique characters, word count, SHA-256 hash, and character frequency map.

---

## 📦 Features
- Analyze any string and store its computed properties
- Check if a string is a palindrome
- Count words, unique characters, and character frequency
- Retrieve, filter, and delete strings
- Supports natural language filtering (e.g. "all single word palindromic strings")

---

## 🧰 Tech Stack
- Node.js
- Express.js
- Crypto (built-in for hashing)
- Railway for deployment

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/YOUR_USERNAME/string-analyzer.git
cd string-analyzer
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Run Locally
bash
Copy code
npm run dev
Server starts at:
➡️ http://localhost:3000

🧪 API Endpoints
🔹 Analyze String
POST /strings

json
Copy code
{
  "value": "madam"
}
🔹 Get All Strings with Filters
GET /strings?is_palindrome=true&min_length=5

🔹 Get Specific String
GET /strings/madam

🔹 Natural Language Query
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings

🔹 Delete String
DELETE /strings/madam

🚀 Deployment
Deployed on Railway

API Base URL:
https://your-app-name.up.railway.app

👨‍💻 Author
Ahmad Abdurrahman Muhammad
Backend Wizard Intern
📧 ahmad@example.com
🌍 Nigeria

yaml
Copy code

---

## ☁️ 7️⃣ Deploy to Railway (Step-by-Step)

1. Go to [https://railway.app](https://railway.app)
2. Sign in with GitHub
3. Create a **New Project → Deploy from GitHub Repo**
4. Select your `string-analyzer` repository
5. Railway auto-detects Node.js
6. Add environment variable if needed (none required here)
7. Click **Deploy**
8. Copy the generated URL (e.g. `https://string-analyzer-production.up.railway.app`)
