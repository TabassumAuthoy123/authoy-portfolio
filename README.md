# Tabassum Authoy — Commercial Portfolio CMS Platform

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

A **commercial-grade, production-ready** portfolio CMS with full CRUD, admin panel, B2B client management, and security hardening.

</div>

---

## ═══════════════════════════════════════
##   🔐 ADMIN PANEL CREDENTIALS
## ═══════════════════════════════════════

| Field    | Value                                            |
|----------|--------------------------------------------------|
| **URL**  | `https://your-domain.com/login` or `http://localhost:5173/login` |
| **Email**    | `authoy@email.com`                           |
| **Password** | `AuthoyAdmin@2026!`                          |

> ⚠️ **Change the password immediately** after first login via Admin → Security → Change Password.

---

## ═══════════════════════════════════════
##   🏢 B2B / B2C CLIENT PORTAL
## ═══════════════════════════════════════

| Field    | Value                                            |
|----------|--------------------------------------------------|
| **URL**  | `https://your-domain.com/client-portal` or `http://localhost:5173/client-portal` |
| **Auth** | Sign in using the default seeded key `pk_authoyb2cclientkey2026` or a generated API key created in the Admin Panel |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Clone & Install

```bash
git clone https://github.com/TabassumAuthoy123/authoy-portfolio.git
cd authoy-portfolio

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example server/.env
```

Edit `server/.env` with your values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database & Run

```bash
# Seed initial data (from server directory)
cd server && node seed.js

# Start backend (from server directory)
npm start

# Start frontend (from client directory, in a new terminal)
cd client && npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:5173/login

---

## 🏗️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19 + Vite 7 + React Router 7 |
| Backend     | Express 5 + Mongoose 9 + JWT       |
| Database    | MongoDB (Atlas or Local)            |
| File Upload | Cloudinary + Multer                 |
| Security    | Helmet + Rate Limiting + Sanitize   |
| Validation  | express-validator                   |
| Deployment  | Vercel (serverless)                 |

---

## 📁 Project Structure

```
authoy-portfolio/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/               # Axios API client
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── App.jsx            # Router setup
│   │   └── index.css          # Global styles
│   ├── index.html             # SEO-optimized entry
│   └── vite.config.js         # Build configuration
├── server/                    # Express backend
│   ├── config/                # Database config
│   ├── middleware/            # Auth, error handling, rate limiting, validation
│   ├── models/                # Mongoose schemas (13 models)
│   ├── routes/                # API endpoints (15 route files)
│   ├── seed.js                # Database seeder
│   └── server.js              # Express app entry
├── .env.example               # Environment template
├── vercel.json                # Deployment config
└── README.md                  # This file
```

---

## 🔒 Security Features

- **Helmet** — HTTP security headers
- **express-rate-limit** — API rate limiting (per-route: auth 5/15min, contact 5/hr, API 100/15min)
- **express-mongo-sanitize** — NoSQL injection prevention
- **express-validator** — Input validation on all write routes
- **bcryptjs** — Password hashing (salt rounds: 10)
- **JWT** — Token-based authentication (7-day expiry)
- **Honeypot** — Spam prevention on contact form
- **CORS** — Strict origin whitelist

---

## 📊 Admin Panel Features

| Feature              | Description                                         |
|----------------------|-----------------------------------------------------|
| **Dashboard**        | Analytics cards, activity log, quick actions         |
| **Content CRUD**     | Projects, Skills, Experience, Achievements, Articles, Gallery |
| **Messages**         | Contact form messages with read/unread status        |
| **B2B Clients**      | Client management with API key generation            |
| **Site Settings**    | SEO, branding, social links, feature toggles         |
| **Security**         | Password change from admin panel                     |
| **Backup/Restore**   | Full database export & import (JSON)                 |
| **Search/Filter**    | Global search on all data tables                     |
| **Activity Log**     | Track all CRUD operations (auto-expires 90 days)     |
| **Theme Toggle**     | Dark/Light mode                                      |

---

## 🌐 API Endpoints

### Public
| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/projects`        | List all projects      |
| GET    | `/api/skills`          | List all skills        |
| GET    | `/api/experience`      | List all experience    |
| GET    | `/api/achievements`    | List all achievements  |
| GET    | `/api/leadership`      | List leadership items  |
| GET    | `/api/articles`        | Published articles     |
| GET    | `/api/gallery`         | Gallery items          |
| GET    | `/api/profile`         | Profile data           |
| GET    | `/api/settings`        | Site settings          |
| POST   | `/api/contact`         | Send contact message   |
| GET    | `/api/health`          | Health check           |

### Admin (requires `Authorization: Bearer <token>`)
| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| POST   | `/api/auth/login`              | Admin login              |
| POST   | `/api/auth/verify`             | Verify token             |
| POST   | `/api/auth/change-password`    | Change password          |
| POST   | `/api/auth/forgot-password`    | Send OTP                 |
| POST   | `/api/auth/reset-password`     | Reset with OTP           |
| GET    | `/api/analytics/dashboard`     | Dashboard stats          |
| GET    | `/api/backup/export`           | Export DB as JSON        |
| POST   | `/api/backup/import`           | Import JSON backup       |
| CRUD   | `/api/projects`                | Projects management      |
| CRUD   | `/api/skills`                  | Skills management        |
| CRUD   | `/api/experience`              | Experience management    |
| CRUD   | `/api/achievements`            | Achievements management  |
| CRUD   | `/api/leadership`              | Leadership management    |
| CRUD   | `/api/articles`                | Articles management      |
| CRUD   | `/api/gallery`                 | Gallery management       |
| CRUD   | `/api/clients`                 | B2B client management    |
| PUT    | `/api/settings`                | Update site settings     |
| PUT    | `/api/profile`                 | Update profile           |

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — Strong random secret
   - `NODE_ENV=production`
   - `CLIENT_URL` — Your domain (e.g., `https://tabassumauthoy.me`)
4. Deploy!

### Custom Domain Setup
1. In Vercel → Settings → Domains → Add `tabassumauthoy.me`
2. Update DNS records as instructed by Vercel

---

## 📜 Environment Variables

See [.env.example](./.env.example) for all required variables.

| Variable                | Required | Description                         |
|-------------------------|----------|-------------------------------------|
| `MONGO_URI`             | ✅       | MongoDB connection string           |
| `JWT_SECRET`            | ✅       | JWT signing secret                  |
| `PORT`                  | ❌       | Server port (default: 5000)         |
| `NODE_ENV`              | ❌       | Environment (development/production)|
| `CLIENT_URL`            | ❌       | Frontend URL for CORS               |
| `RATE_LIMIT_WINDOW`     | ❌       | Rate limit window in ms             |
| `RATE_LIMIT_MAX`        | ❌       | Max requests per window             |
| `CLOUDINARY_CLOUD_NAME` | ❌       | Cloudinary cloud name               |
| `CLOUDINARY_API_KEY`    | ❌       | Cloudinary API key                  |
| `CLOUDINARY_API_SECRET` | ❌       | Cloudinary API secret               |
| `EMAIL_USER`            | ❌       | Gmail for OTP sending               |
| `EMAIL_PASS`            | ❌       | Gmail app password                  |

---

## 📱 Android Companion App Workflow

The repository includes a mobile companion app built in Jetpack Compose that connects to the backend portfolio API.

### Build & Package APK

1. Ensure the backend server is running at `http://localhost:5000` (or `http://10.0.2.2:5000` inside the Android Emulator).
2. Configure **JAVA_HOME** pointing to JDK 17 (pre-installed locally for this user at `C:\Users\SBD - Commercial 23\.android\jdk17\jdk-17.0.19+10`).
3. Compile the debug APK using Gradle:

```powershell
cd android-app
$env:JAVA_HOME="C:\Users\SBD - Commercial 23\.android\jdk17\jdk-17.0.19+10"
.\gradlew.bat assembleDebug
```

4. Locate the compiled debug binary at:
   `android-app/app/build/outputs/apk/debug/app-debug.apk`

### 📲 How to Install & Test the APK

#### On Android Studio Emulator
1. Start your Android Virtual Device (AVD) emulator inside Android Studio.
2. Drag and drop the `app-debug.apk` file directly onto the active emulator screen.
3. The app will install automatically. Open it from the app drawer.

#### On a Physical Mobile Device
1. Transfer the `app-debug.apk` file to your Android phone (via USB, Google Drive, share apps, etc.).
2. Locate the APK file on your mobile using a File Manager and tap it to install. (Enable "Install from Unknown Sources" if prompted).
3. **Note:** To see dynamic data from the backend, make sure your mobile and server are on the same Wi-Fi network, and update the base API URL in the code to your local machine's IP address instead of `10.0.2.2`.

---

## 📄 License

© 2026 Tabassum Authoy. All rights reserved.
