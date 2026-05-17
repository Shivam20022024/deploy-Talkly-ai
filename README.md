# TalklyAI - Revenue Intelligence Platform

TalklyAI is an enterprise-grade conversation intelligence platform that transforms unstructured customer conversations into actionable sales intelligence. It helps sales teams detect buyer intent, automate lead scoring, and coach agents at scale.

## 📢 Recent Updates

### New Feature Update: Create Account Page Added & Code Uploaded to GitHub

We’ve introduced a new Create Account (User Registration) page to improve the onboarding experience for new users.

#### What’s New
- **Create Account / Sign Up Page Added**
- New users can now register directly from the application.
- Simple and user-friendly registration flow.
- Improved authentication journey alongside the existing login functionality.

#### Code Updates
- Integrated frontend changes for the registration page.
- Updated authentication flow and routing.
- UI enhancements for a smoother user experience.

## 🚀 Key Features

- **Voice Intelligence**: Industry-leading transcription and entity extraction for complex sales cycles.
- **Lead Intelligence**: Dynamic lead scoring that adapts to conversation context and intent markers.
- **Agent Performance**: Real-time benchmarking against top performers with automated feedback loops.
- **Live Conversation Monitoring**: Real-time oversight for managers to assist in high-stakes deal negotiations.
- **Premium Login Page**: A secure, glassmorphic login interface for authorized access.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Framework**: Python with FastAPI (Uvicorn)
- **Database**: SQLite
- **AI Integration**: Custom analysis pipeline for transcripts

## 📁 Project Structure

```text
voice-ai/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components (Sidebar, Tables, etc.)
│   │   ├── views/        # Page views (Dashboard, Login, Landing, etc.)
│   │   ├── contexts/     # Auth Context and state management
│   │   └── App.tsx       # Main application & state-based routing
└── backend/              # Python FastAPI server
    ├── server.py         # API entry point
    ├── requirements.txt  # Python dependencies
    └── transcripts/      # Stored transcript data
```

## ⚙️ Local Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.11+)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python server.py
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Access Credentials

For demonstration purposes, you can use the following credentials on the login page:
- **Email**: `admin@talkly.ai`
- **Password**: `admin`

---
Built for modern sales teams.