# Deployment Guide

This document explains how to deploy HealthMate to a live environment so it can be accessed by testers, instructors, and end users.

---

## 1. Deployment Targets

**Recommended:**

- **Frontend:** Vercel or Netlify (fast CI/CD for React + Vite)
- **Backend API:** Render, Railway, or Heroku (free tiers available)
- **Database:** MongoDB Atlas (cloud-hosted NoSQL database)

---

## 2. Pre-Deployment Checklist

Before deploying:

- Push your latest code to the `main` branch on GitHub.
- Test the app locally (`npm run start:all`) to ensure no errors.
- Ensure `.env` files are set up for local and production environments.
- Remove any development-only credentials from commits.

---

## 3. Environment Variables

### Backend `.env`

MONGO_URI=mongodb+srv://HealthMate:HN4SHENYHUsA3rKN@healthmate.ujdzyy8.mongodb.net/HealthMateDB?retryWrites=true&w=majority

PORT=5000

### Frontend `.env`

- **Local (create `.env.local`):**
  VITE_API_URL=http://localhost:5000

  **Production (Netlify/Vercel project settings → Environment Variables):**
  VITE_API_URL=https://https://healthmateweb.netlify.app/

---

## 4. Deploying Backend (Example: Render)

1. Go to [Render](https://render.com/), create an account, and click **New Web Service**.
2. Connect your GitHub repository.
3. Set the root directory to the backend folder (if separated).
4. Add **Environment Variables** from your `.env`.
5. Set the build command:

npm install

and start command:

npm start

6. Deploy and wait for the URL to be generated.

---

## 5. Deploying Frontend (Example: Vercel)

1. Go to [Vercel](https://vercel.com/), create an account, and import your repo.
2. If your frontend is in a subfolder, specify it in the Vercel project settings.
3. Add `VITE_API_URL` in **Environment Variables** pointing to the backend’s live URL.
4. Click **Deploy** — Vercel will give you a public link.

---

## 6. Post-Deployment Testing

- Log in using [Test Accounts](TEST_ACCOUNTS.md).
- Check all main features:
- Dashboard loads with real data.
- Task creation and deletion work.
- Prescriptions display and update.
- Chatbot responds to messages.
- Verify on both mobile and desktop browsers.

---

## 7. Common Issues

- **CORS errors:** Ensure the backend includes CORS middleware with the frontend domain whitelisted.
- **Environment variable mismatch:** Make sure `VITE_API_URL` matches the deployed backend URL exactly.
- **Build failures:** Double-check Node.js version and lock files.

---

## 8. Maintenance

- Keep dependencies updated.
- Monitor Render/MongoDB usage quotas.
- Backup database regularly via MongoDB Atlas backup tools.
