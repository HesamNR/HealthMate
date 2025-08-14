# Installation Instructions (Local)

## Prerequisites

- Node.js (v16+)
- npm (v8+)
- MongoDB Atlas account

## Steps

1. Clone the repo:

```bash
git clone https://github.com/HesamNR/HealthMate.git
cd HealthMate
```

Install dependencies:

npm install

Set up .env file with:

MONGO_URI=mongodb+srv://HealthMate:HN4SHENYHUsA3rKN@healthmate.ujdzyy8.mongodb.net/HealthMateDB?retryWrites=true&w=majority

PORT=5000

Start both client & server:

npm run start:all

Open http://localhost:5173 in browser.

---

### **docs/DEPLOY.md**

```markdown
# Deployment on Public Server

## Recommended Stack

- **Frontend:** Vercel or Netlify
- **Backend:** Render, Railway, or Heroku
- **Database:** MongoDB Atlas

## Steps (Example: Render + Vercel)

1. Push code to a public GitHub repo.
2. Create a MongoDB Atlas cluster.
3. Deploy backend on Render:
   - Link repo
   - Add environment variables from `.env`
4. Deploy frontend on Vercel:
   - Set `VITE_API_URL` to your backend's public URL.

## Test Accounts

See [Test Accounts](TEST_ACCOUNTS.md) for login credentials.
```
