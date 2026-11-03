# SHERÉ Moments 🌸

**SHERÉ Moments** is a digital celebration and invitation platform designed to help people create, personalize, and share beautiful digital moments for special occasions.

Instead of relying only on traditional paper invitations or ordinary messages, SHERÉ Moments provides a simple way to create a more personal and memorable digital celebration experience.

> **Every celebration deserves a special moment.**

---

## 🌐 Live Website

Visit the live SHERÉ Moments website:

**https://shere-celebretion-moments.netlify.app/**

---

## ✨ What is SHERÉ Moments?

SHERÉ Moments allows users to create digital invitations and celebration pages for important occasions.

The platform brings together **design, personalization, memories, and messages** into one digital experience.

Users can choose an occasion, select a suitable design, personalize their invitation, preview it, and share it with friends and family.

---

## 🎉 What Can Users Do?

With SHERÉ Moments, users can:

- 🎊 Choose an occasion for their celebration
- 💌 Select from occasion-specific invitation designs
- ✍️ Personalize invitations with their own information
- 🖼️ Add a personal photo where supported
- 👀 Preview their invitation before sharing
- 🔗 Share invitations with friends and family
- 💬 Create and receive celebration messages
- 👤 Create an account and securely sign in
- 📊 Access invitations and messages through a personal dashboard
- 📩 Contact the SHERÉ Moments team through the contact form

---

## 🎈 Supported Celebration Experiences

SHERÉ Moments is designed to support different types of special occasions, including:

- 🎂 Birthdays
- 💍 Weddings
- ❤️ Anniversaries
- 🎓 Graduations
- 👶 Baby celebrations
- 🙏 Thank-you moments
- 🎉 General celebrations
- 💐 Other personal and memorable occasions

The platform can use different designs and decorative elements depending on the selected occasion.

---

## 💡 How It Works

The basic experience follows a simple flow:

```text
Choose an Occasion
        ↓
Choose a Design
        ↓
Personalize Your Invitation
        ↓
Add Your Details / Photo
        ↓
Preview Your Invitation
        ↓
Share Your Celebration
        ↓
Receive Celebration Messages
```

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend & Services

- Python FastAPI (API, login and accounts)
- PostgreSQL on Neon (database)
- Resend (emails from the contact form)

### Deployment

- GitHub — source code and version control
- Netlify — frontend hosting
- Render — backend hosting
- Neon — database hosting

---

## 🏗️ Application Architecture

SHERÉ Moments uses a modern web application architecture:

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend   │
                    │  TypeScript + Vite  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │  Hosted on Render   │
                    └─────┬─────────┬─────┘
                          │         │
                          ▼         ▼
              ┌──────────────┐  ┌──────────────┐
              │  PostgreSQL  │  │    Resend    │
              │   on Neon    │  │ Contact email│
              └──────────────┘  └──────────────┘
```

---

## 📁 Project Structure

```text
shere-celebration-moments/
│
├── public/
│   └── # Public assets and branding
│
├── src/
│   ├── components/
│   │   └── # Reusable UI components
│   │
│   ├── hooks/
│   │   └── # React hooks
│   │
│   ├── lib/
│   │   └── # API client and helpers
│   │
│   ├── data/
│   │   └── # Invitation designs, message templates and fonts
│   │
│   └── pages/
│       └── # Application pages
│
├── tests/
│   └── # Frontend tests
│
├── backend/
│   ├── app/
│   │   └── # FastAPI app, routes and database models
│   │
│   └── tests/
│       └── # Backend tests
│
├── render.yaml
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/GloryMungathia/shere-celebration-moments.git
```

### 2. Enter the project directory

```bash
cd shere-celebration-moments
```

### 3. Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

The API runs at http://localhost:8000 and its docs are at http://localhost:8000/docs.

### 4. Start the frontend

In a second terminal, from the project folder:

```bash
npm install
cp .env.example .env
npm run dev
```

The application opens at http://localhost:5173.

**Never commit your `.env` file or private keys to GitHub.**

### 5. Run the tests

```bash
cd backend && pytest --cov=app
cd .. && npm run test:coverage
```

### 6. Run the browser tests (Playwright)

The browser tests use the app the way a real user would: sign up, design and publish invitations, send messages, and check login safety and the phone layout.

Install the browser once:

```bash
npx playwright install chromium
```

Run them on your computer. They start their own backend and website with a fresh test database:

```bash
npm run test:e2e
```

Run them against the live site:

```bash
E2E_BASE_URL=https://your-site.netlify.app npm run test:e2e
```

Open the last report with `npm run test:e2e:report`.

---

## 🏭 Production Build

To create a production build:

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

---

## ☁️ Deployment

The SHERÉ Moments frontend is deployed using **Netlify**.

The production deployment is connected to the GitHub repository and uses the `main` branch.

### Production configuration

```text
Build command:
npm run build

Publish directory:
dist
```

In Netlify, set `VITE_API_URL` to the Render backend address.

The backend is deployed on **Render** using `render.yaml`. The database is a free **Neon** PostgreSQL database.

Render settings:

| Variable | Value |
| --- | --- |
| DATABASE_URL | The Neon connection string |
| FRONTEND_ORIGINS | The Netlify site address |
| SECRET_KEY | Created by Render |
| RESEND_API_KEY | The Resend API key |
| ADMIN_EMAIL | The email that receives contact messages |
| RESEND_FROM_EMAIL | The sender, for example `SHERÉ Moments <onboarding@resend.dev>` |

---

## 🔐 Environment Variables

Environment variables are used to configure the application without exposing sensitive configuration in the source code.

Example:

```env
VITE_API_URL=http://localhost:8000
```

The backend has its own example file at `backend/.env.example`.

The `.env.example` file contains placeholder values for development and documentation purposes.

The actual `.env` file should remain local and should **not** be committed to GitHub.

---

## 🔒 Security

SHERÉ Moments follows basic security practices including:

- Passwords are hashed with scrypt and never stored as plain text
- One email can only have one account
- Login pauses for 3 minutes after 5 wrong passwords
- Users can only see and change their own invitations and messages
- Guests can only see invitations and messages that were published
- The contact form is limited to 5 messages per 10 minutes
- Only the SHERÉ Moments website can call the API
- Private keys live in Render and Netlify settings, never in the code

---

## 🎯 Project Goal

The goal of SHERÉ Moments is to make digital celebrations feel more personal, beautiful, and memorable.

The platform combines:

```text
Design
   +
Personalization
   +
Memories
   +
Messages
   =
A Digital Celebration Experience
```

SHERÉ Moments aims to give people a simple way to celebrate the important moments in their lives and share those moments with the people who matter to them.

---

## 🔮 Future Improvements

Future versions of SHERÉ Moments may include:

- More celebration categories
- More invitation templates
- More personalization options
- Additional photo and media support
- Custom invitation URLs
- Custom domains
- Improved email notifications
- Invitation analytics
- Social media sharing
- Additional celebration features
- More advanced customization tools

---

## 👩🏽‍💻 Project Information

**Project:** SHERÉ Moments

**Type:** Digital Celebration & Invitation Platform

**Frontend:** React + TypeScript + Vite + Tailwind CSS

**Backend:** FastAPI + PostgreSQL (Neon)

**Hosting:** Netlify (frontend) and Render (backend)

**Repository:**  
https://github.com/GloryMungathia/shere-celebration-moments

**Live Website:**  
https://shere-celebration-moments.netlify.app

---

## ❤️ SHERÉ Moments

**Create a moment. Personalize it. Share the celebration.**

Built with React, TypeScript, Tailwind CSS, FastAPI, Neon, Render and Netlify.
