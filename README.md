# SHERÉ Moments 🌸

**SHERÉ Moments** is a digital celebration and invitation platform designed to help people create, personalize, and share beautiful digital moments for special occasions.

Instead of relying only on traditional paper invitations or ordinary messages, SHERÉ Moments provides a simple way to create a more personal and memorable digital celebration experience.

> **Every celebration deserves a special moment.**

---

## 🌐 Live Website

Visit the live SHERÉ Moments website:

**https://shere-celebration-moments.netlify.app**

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

- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Storage
- Supabase Edge Functions
- Resend for email delivery

### Deployment

- GitHub — source code and version control
- Netlify — frontend hosting
- Supabase — backend services

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
                    │      Supabase       │
                    ├─────────────────────┤
                    │ Authentication      │
                    │ PostgreSQL Database │
                    │ Storage             │
                    │ Edge Functions      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Resend        │
                    │   Email Delivery    │
                    └─────────────────────┘
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
│   │   └── # Supabase and application helpers
│   │
│   └── pages/
│       └── # Application pages
│
├── supabase/
│   ├── functions/
│   │   └── # Supabase Edge Functions
│   │
│   └── migrations/
│       └── # Database migrations
│
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

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a local `.env` file using `.env.example` as a guide.

The frontend requires the appropriate Supabase project URL and Supabase anonymous key.

**Never commit your `.env` file or private server-side credentials to GitHub.**

### 5. Start the development server

```bash
npm run dev
```

The application will be available locally through the Vite development server.

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

The backend services are provided by Supabase, including:

- Authentication
- PostgreSQL database
- File storage
- Edge Functions

---

## 🔐 Environment Variables

Environment variables are used to configure the application without exposing sensitive configuration in the source code.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The `.env.example` file contains placeholder values for development and documentation purposes.

The actual `.env` file should remain local and should **not** be committed to GitHub.

---

## 🔒 Security

SHERÉ Moments follows basic security practices including:

- Environment variables for configuration
- Supabase authentication
- Supabase database security policies
- Supabase storage policies
- Server-side handling of sensitive email configuration
- Keeping private credentials out of the Git repository

Frontend environment variables should only contain values that are safe to expose to the browser.

Private server-side credentials such as service-role keys and email API keys should never be placed in frontend code.

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

**Backend:** Supabase

**Hosting:** Netlify

**Repository:**  
https://github.com/GloryMungathia/shere-celebration-moments

**Live Website:**  
https://shere-celebration-moments.netlify.app

---

## ❤️ SHERÉ Moments

**Create a moment. Personalize it. Share the celebration.**

Built with React, TypeScript, Tailwind CSS, Supabase, and Netlify.