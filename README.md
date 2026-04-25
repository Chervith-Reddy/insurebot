# 🛡️ InsureBot — AI-Powered Insurance Claims Assistant

A full-stack application for managing insurance claims with AI classification, real-time status tracking, admin dashboard, analytics, and email notifications.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, TypeScript, Vite, Recharts |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose |
| AI | OpenAI GPT-3.5-turbo (with rule-based fallback) |
| Email | Nodemailer (Gmail SMTP) |
| Charts | Recharts |

## Features

- **Claim Submission** — Policy number, incident type, description, amount, contact info
- **AI Classification** — LLM-powered claim type detection (accident, health, property, vehicle)
- **Status Pipeline** — Pending → Under Review → Approved/Rejected
- **Admin Dashboard** — Full claims table with filters, pagination, status management
- **Analytics** — Claims by type (bar chart), by status (pie chart), monthly trends (line chart)
- **Email Notifications** — Automatic emails on every status change via Nodemailer
- **Fallback AI** — Rule-based classification when OpenAI key is not configured

## Project Structure

```
insurebot/
├── backend/          # Express.js REST API (TypeScript)
│   └── src/
│       ├── config/       # Database connection
│       ├── controllers/  # Route handlers
│       ├── middleware/    # Error handling, validation
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       ├── services/      # AI, Email, Analytics logic
│       └── types/         # TypeScript interfaces
└── frontend/         # React.js SPA (TypeScript + Vite)
    └── src/
        ├── api/          # Axios API client
        ├── components/   # Reusable React components
        ├── pages/        # Page-level components
        └── types/        # TypeScript interfaces
```

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key (optional — falls back to rule-based classification)
- Gmail account with App Password (optional — for email notifications)

## Setup Instructions

### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd insurebot
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insurebot
OPENAI_API_KEY=your_openai_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@yourcompany.com
NODE_ENV=development
```

> **Getting Gmail App Password:**
> 1. Enable 2FA on your Google account
> 2. Go to Google Account → Security → App Passwords
> 3. Generate a password for "Mail"
> 4. Use that 16-character password as `SMTP_PASS`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start MongoDB (if running locally)

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use Docker
docker run -d -p 27017:27017 --name insurebot-mongo mongo:7
```

## Running the Application

### Option A: Run Both Servers Separately

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Server starts at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
App opens at: `http://localhost:5173`

### Option B: Using Concurrently (from root)

Create `package.json` in root:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then:
```bash
npm install
npm run dev
```

## API Endpoints

### Claims

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/claims` | Submit new claim |
| `GET` | `/api/claims` | Get all claims (paginated) |
| `GET` | `/api/claims/:id` | Get claim by ID |
| `GET` | `/api/claims/policy/:policyNumber` | Get claims by policy |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/api/admin/claims/:id/status` | Update claim status |
| `DELETE` | `/api/admin/claims/:id` | Delete a claim |
| `GET` | `/api/admin/analytics` | Get analytics data |
| `GET` | `/api/admin/stats` | Get quick stats |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | API health check |

## Example API Usage

### Submit a Claim

```bash
curl -X POST http://localhost:5000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-123456",
    "incidentType": "Car Accident",
    "description": "I was involved in a rear-end collision on the highway. My vehicle sustained significant damage to the rear bumper and trunk area.",
    "amount": 5500,
    "claimerEmail": "john@example.com",
    "claimerName": "John Doe"
  }'
```

### Update Claim Status

```bash
curl -X PATCH http://localhost:5000/api/admin/claims/<claim_id>/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Approved",
    "note": "All documents verified. Claim approved for full amount."
  }'
```

## Building for Production

```bash
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm run preview
```

## Environment Variables Reference

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `OPENAI_API_KEY` | No | OpenAI API key (fallback used if missing) |
| `SMTP_HOST` | No | SMTP server host |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP username/email |
| `SMTP_PASS` | No | SMTP password/app password |
| `ADMIN_EMAIL` | No | Admin email for notifications |
| `NODE_ENV` | No | Environment (development/production) |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Backend API URL (default: http://localhost:5000/api) |

## Troubleshooting

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**TypeScript Errors**
```bash
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

**OpenAI Not Working**
- The app automatically falls back to rule-based classification
- Check your API key at https://platform.openai.com/api-keys
- Ensure you have billing set up on your OpenAI account
