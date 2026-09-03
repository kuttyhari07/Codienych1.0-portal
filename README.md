# CODIENYCH 1.0 — 24-Hour Software Hackathon Portal

> **"24 Hours of Coding, Creativity and Innovation."**
> A cinematic dark futuristic, post-apocalyptic, superhero mission software hackathon web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

---

## ⚡ Visual Identity & Experience
- **Theme**: Dark Futuristic + Post-Apocalyptic + Superhero Mission + Technology.
- **Color Direction**: Black (`#050b07`), Dark Green (`#0f1e14`), Neon/Toxic Green (`#00ff66`, `#10b981`), White/Light Gray (`#ffffff`, `#e2e8f0`).
- **Scroll-Based Cinematic Scenes**: Sticky background layer with smooth opacity, blur, and scale crossfades across 12 distinct hero/guardian scenes.
- **Interactive Treasure Box**: Click to open, unlocking lightning effects and revealing **CASH PRIZES UP TO ₹1 LAKH**.
- **Loading Screen**: Futuristic CODIENYCH 1.0 logo entrance animation.

---

## 🏗 Project Architecture

```text
codienych/
│
├── client/                     # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # LoadingScreen, Navbar, CinematicBackground, TreasureBox
│   │   ├── pages/              # HomePage, RegisterPage, StatusPage, Admin Pages
│   │   ├── sections/           # Hero, About, Dates, Countdown, Problem, Rules, Timeline, Prizes, FAQ, Contact, Footer
│   │   ├── services/           # Axios API Client
│   │   ├── utils/              # Configuration & Constants
│   │   ├── App.jsx             # React Router Paths
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind CSS directives & Glow Effects
│   ├── index.html              # Google Fonts & Dark Theme Meta
│   ├── vite.config.js          # Vite config & API Proxy
│   └── package.json
│
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── config/                 # Database & Env Configuration
│   ├── controllers/            # Registration & Admin Controller Logic
│   ├── middleware/             # JWT Authentication & Multer Storage Middleware
│   ├── models/                 # Admin, Registration, Participant, Payment Mongoose Models
│   ├── routes/                 # Public & Admin Express Routes
│   ├── services/               # Storage (Cloudinary/Local) & Email (Nodemailer) Services
│   ├── scripts/                # Seed script for initial Super Admin
│   ├── uploads/                # Local storage fallback directory
│   ├── server.js               # Express application setup
│   └── package.json
│
├── .env.example                # Template for environment variables
├── README.md                   # Full documentation & deployment guide
└── package.json                # Root package with concurrently scripts
```

---

## 🛠 Features & Verification Checklist

- [x] **Full MERN Stack**: React (Vite + Tailwind CSS), Node.js (Express), MongoDB (Mongoose).
- [x] **Dynamic Team Sizes**: Supports teams of **4, 5, or 6 members**.
- [x] **Participant ID Uploads**: Every member (Leader & Team Members) must upload an individual student ID card (JPG, PNG, WEBP).
- [x] **Server-side Fee Calculation**: ₹567 / participant (recalculated on backend independently).
- [x] **Direct UPI QR Payment**: Displays QR code & UPI ID, accepts 12-digit UTR/Transaction ID & Screenshot upload.
- [x] **Unique Registration ID**: Server-generated unique ID (e.g. `CODIENYCH-2026-00125`).
- [x] **Duplicate Prevention**: Database unique indexes prevent duplicate Emails, Student IDs, or UPI Transaction UTR numbers.
- [x] **Public Status Page (`/status`)**: Check registration status by Registration ID without exposing sensitive emails or ID cards.
- [x] **Admin Control Center (`/admin`)**:
  - Secure JWT authentication & bcrypt password hashing.
  - Operational metrics dashboard (Total Teams, Participants, Collection ₹, Pending/Verified/Rejected Payments, Pending ID Cards).
  - Inspect full team details, payment screenshots, and participant ID photos.
  - Verify or Reject payment (mandatory rejection reason).
  - Verify or Reject student ID cards individually (mandatory rejection reason).
  - Automatic status updates to `REGISTRATION CONFIRMED` when all checks pass.
  - Triggers automated Nodemailer HTML email confirmation to Team Leader.

---

## 🚀 Setup & Local Execution Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas database URI or local MongoDB daemon (`mongodb://127.0.0.1:27017`)

### 2. Install Dependencies
In the root directory, run:
```bash
npm run install-all
```
This will automatically run `npm install` in root, `server/`, and `client/`.

### 3. Environment Variables
Create `server/.env` by copying `server/.env.example`. Never commit this file:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<generate a strong random secret>

REGISTRATION_FEE=567
UPI_ID=<your UPI ID>

ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD=<strong admin password>
```

### 4. Seed Super Admin Account
Run the admin seed script:
```bash
npm run seed-admin
```
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` securely before running the seed script.

### 5. Start Development Servers
Run frontend and backend concurrently:
```bash
npm run dev
```
- **Client**: `http://localhost:5173`
- **Server**: `http://localhost:5000`
- **Admin Login**: `http://localhost:5173/admin/login`

---

## 📦 Deployment Instructions

### Frontend (Vercel / Netlify)
1. Push `client/` directory to Git repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

### Backend (Render / Railway / Heroku)
1. Deploy `server/` directory to Node hosting.
2. Build / Start command: `npm start`
3. Environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-client-domain.com`. Set `USE_CLOUDINARY=true` with Cloudinary credentials for persistent production uploads.
4. (Optional) Configure Cloudinary credentials (`USE_CLOUDINARY=true`) for production cloud storage.

---

## 🏆 Credits & License
Created for **CODIENYCH 1.0** — 24-Hour Software Hackathon.
ISC License.
