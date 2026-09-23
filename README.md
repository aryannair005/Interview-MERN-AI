## 🏗️ Architecture



```
┌───────────────────────────────┐
│        React + Vite           │
│                               │
│  Auth • Interview • History   │
│  Reports • Pricing • Redux    │
└───────────────┬───────────────┘
                │ Axios / Cookies
                ▼
┌───────────────────────────────┐
│       Express API Server      │
│                               │
│ Auth • User • Interview       │
│ Payment • JWT Middleware      │
└───────┬──────────────┬────────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌─────────────────┐
│   MongoDB    │  │  External APIs   │
│              │  │                 │
│ Users        │  │ OpenRouter      │
│ Interviews   │  │ Razorpay        │
│ Payments     │  │                 │
└──────────────┘  └─────────────────┘
```

## 🔄 Application Flow

### 1. Authentication

The user signs in with Google. The frontend sends the user's basic profile information to the backend. The server creates or finds the MongoDB user, generates a JWT, and stores it in an HTTP cookie.

### 2. Interview Setup

The user selects:

- Target role
- Experience level
- Interview mode: HR or Technical

A resume PDF can also be uploaded.

### 3. Resume Analysis

The backend receives the PDF through Multer, reads the document using PDF.js, extracts its text, and sends the text to the AI service.

The AI returns structured resume information:

```json
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
```

The extracted information is then used to personalize the interview.

### 4. Question Generation

The backend sends the candidate context to OpenRouter.

The AI is instructed to generate exactly five questions with progressive difficulty:

```
Q1 → Easy
Q2 → Easy
Q3 → Medium
Q4 → Medium
Q5 → Hard
```

Each question receives a time limit and the interview consumes credits from the user's balance.

### 5. Voice Interview

During the interview, the browser handles voice interaction:

- **Speech Synthesis** reads questions and feedback aloud.
- **Speech Recognition** captures the candidate's spoken answer.
- A timer controls the allowed response time.
- When time expires, the answer is automatically submitted.

The interface also shows an animated interviewer video.

### 6. Answer Evaluation

Each submitted answer is sent to the backend and evaluated by the AI using three dimensions:

```
Confidence      → 0–10
Communication   → 0–10
Correctness     → 0–10
```

The final question score is the rounded average of these three metrics.

The result and AI feedback are persisted in MongoDB.

### 7. Interview Completion

After all questions are answered, the backend calculates:

- Final interview score
- Average confidence
- Average communication
- Average correctness
- Question-wise scores and feedback

The completed interview is then available in the user's history.

### 8. Reports & Analytics

The report dashboard provides:

- Overall score
- Skill evaluation
- Performance trend
- Question breakdown
- AI feedback

Users can export the complete report as a PDF.

### 9. Credits & Payments

Users receive credits and spend them to generate interviews.

Current pricing configured in the frontend:

| Plan | Price | Credits |
|---|---:|---:|
| Free | ₹0 | 100 |
| Starter Pack | ₹100 | 150 |
| Pro Pack | ₹500 | 650 |

Paid plans use Razorpay. The backend creates the order, verifies the Razorpay signature, records the payment, and adds purchased credits to the user's account.

## 📁 Project Structure

```
Interview-MERN-AI/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── Videos/
│   │   ├── components/
│   │   │   ├── AuthModel.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Step1SetUp.jsx
│   │   │   ├── Step2Interview.jsx
│   │   │   ├── Step3Report.jsx
│   │   │   └── Timer.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   ├── InterviewReport.jsx
│   │   │   └── Pricing.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── userSlice.js
│   │   ├── utils/
│   │   │   └── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── connectDB.js
│   │   └── token.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── interview.controller.js
│   │   ├── payment.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── interview.model.js
│   │   └── payment.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── interview.route.js
│   │   └── payment.route.js
│   ├── services/
│   │   ├── openRouter.service.js
│   │   └── razorpay.service.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

## 🔌 API Overview

Base URL during local development:

```
http://localhost:8000
```

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/google` | Create/login user with Google profile data |
| GET | `/api/auth/logout` | Clear authentication cookie |

### User

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/user/current-user` | Get the authenticated user's profile |

### Interviews

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/interview/resume` | Upload and analyze a resume PDF |
| POST | `/api/interview/generate-questions` | Generate a new AI interview |
| POST | `/api/interview/submit-answer` | Evaluate an answer |
| POST | `/api/interview/finish` | Complete an interview and calculate report data |
| GET | `/api/interview/get-interview` | Get interview history |
| GET | `/api/interview/report/:id` | Get a report for a specific interview |

### Payments

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/payment/order` | Create a Razorpay order |
| POST | `/api/payment/verify` | Verify payment and credit the user |

All interview, user, and payment endpoints that require a signed-in user use the JWT authentication middleware.

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory.

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPEN_ROUTER_APIKEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create a `.env` file inside the `client/` directory for frontend service configuration.

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Use your actual Firebase configuration values required by `client/src/utils/firebase.js`.

> **Security:** Never commit API keys, JWT secrets, Razorpay secrets, Firebase private configuration, or database credentials to GitHub.

## 🚀 Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Firebase project with Google Authentication configured
- OpenRouter API key
- Razorpay account for payment functionality

### 1. Clone the repository

```bash
git clone https://github.com/aryannair005/Interview-MERN-AI.git
cd Interview-MERN-AI
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Configure frontend environment variables

Create `client/.env` and add your Firebase and Razorpay public configuration.

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

### 5. Configure backend environment variables

Create `server/.env` and add MongoDB, JWT, OpenRouter, Razorpay, and port configuration.

### 6. Start the backend

From `server/`:

```bash
npm run dev
```

The backend runs on the port defined by `PORT` (the current frontend configuration expects `http://localhost:8000`).

### 7. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will start the React application, normally at:

```
http://localhost:5173
```

## 🧪 Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm run dev
npm run node_dev
```

## 🗄️ Data Models

### User

Stores account information and credit balance.

```
User
├── name
├── email
├── credits
├── createdAt
└── updatedAt
```

### Interview

Stores the interview configuration, questions, answers, evaluation metrics, final score, and completion status.

```
Interview
├── userId
├── role
├── experience
├── mode
├── resumeText
├── questions[]
├── finalScore
├── status
├── createdAt
└── updatedAt
```

Each question stores:

```
question
difficulty
timeLimit
answer
feedback
score
confidence
communication
correctness
```

### Payment

Stores Razorpay order/payment information and purchased credits.

```
Payment
├── userId
├── planId
├── amount
├── credits
├── razorpayOrderId
├── razorpayPaymentId
├── status
├── createdAt
└── updatedAt
```

## 🔒 Authentication & Authorization

The authentication flow is cookie-based:

```
Google Login
    ↓
POST /api/auth/google
    ↓
Find/Create MongoDB User
    ↓
Generate JWT
    ↓
Set "token" Cookie
    ↓
Authenticated Requests
    ↓
JWT Middleware
    ↓
req.userId
```

Protected routes read the JWT from the `token` cookie and verify it using `JWT_SECRET`.

## 🤖 AI Processing Pipeline

The application uses OpenRouter as the AI gateway and currently sends requests to the `openai/gpt-4o-mini` model.

Two major AI workflows are implemented:

**Resume → Structured Data**

```
PDF Upload
   ↓
Multer
   ↓
PDF.js
   ↓
Resume Text
   ↓
OpenRouter
   ↓
Role / Experience / Projects / Skills
```

**Interview Answer → Evaluation**

```
Question + Candidate Answer
          ↓
       OpenRouter
          ↓
Confidence / Communication / Correctness
          ↓
Final Score + Feedback
          ↓
MongoDB
```

## 💳 Credits System

The interview generation endpoint checks the user's credit balance before generating questions.

The current implementation requires **50 credits per generated interview**.

Example:

```
Available Credits: 150
Interview Cost:     50
Remaining Credits: 100
```

Purchased credits are added to the user's balance after successful Razorpay signature verification.

## 📊 Report Scoring

Each answer receives three AI-generated scores from 0–10.

The question score is calculated as:

```
Final Question Score =
(Confidence + Communication + Correctness) / 3
```

rounded to the nearest whole number.

The overall interview score is the average of all question scores.

## 🌐 Browser Capabilities

Voice functionality uses browser-native Web Speech APIs:

- `SpeechRecognition` / `webkitSpeechRecognition`
- `SpeechSynthesis`

Browser support can vary. If Speech Recognition is unavailable or microphone permission is denied, typed answers remain available.

## 📄 PDF Reports

The frontend generates downloadable reports using:

- jsPDF
- jsPDF AutoTable

The generated report includes:

- Overall score
- Confidence
- Communication
- Correctness
- Professional advice
- Question-wise scores
- AI feedback

## ⚠️ Current Development Notes

This repository is configured primarily for local development. Before production deployment, review environment configuration, CORS origins, cookie security attributes, API error handling, payment idempotency, authorization checks on report access, rate limiting, and secret management.

The frontend currently references the backend at:

```
http://localhost:8000
```

so that URL should be updated for a deployed environment.

## 🔮 Potential Future Improvements

- Adaptive follow-up questions based on previous answers
- Stronger ownership checks for interview reports
- Production-ready authentication/session configuration
- Better microphone/browser compatibility handling
- Interview resume storage with secure object storage
- Rate limiting and abuse protection
- Background AI processing for large resumes
- More interview categories and role templates
- Admin dashboard for plans, users, and interview analytics
- Automated tests for controllers and API routes
- CI/CD with GitHub Actions
- Production deployment configuration

## 👨‍💻 Author

**Aryan Nair**

GitHub: [@aryannair005](https://github.com/aryannair005)

## 📜 License

This project currently does not include a dedicated license file. Add a license before distributing or reusing the project under a formal open-source license.
