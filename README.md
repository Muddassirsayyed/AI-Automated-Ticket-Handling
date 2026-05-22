# 🎯 TicketAI — Automated Ticket Handling System

A production-ready full-stack AI-powered support ticket management system built with React, Node.js, MongoDB, and OpenAI.

## ✨ Features

- 🤖 **AI-Powered Classification** — Auto-categorize tickets into 5 categories
- ⚡ **Priority Detection** — Automatically detect Low/Medium/High/Critical priority
- 💬 **AI Response Suggestions** — Generate smart reply suggestions for agents
- 😊 **Sentiment Analysis** — Detect customer emotions (Positive/Neutral/Negative/Frustrated)
- 🎯 **AI Confidence Score** — Visual confidence indicator for AI predictions
- 📊 **Analytics Dashboard** — Charts with Recharts (trends, categories, sentiment)
- 👥 **Role-Based Access** — User, Agent, Admin roles with protected routes
- 🔐 **JWT Authentication** — Secure login/register with bcrypt password hashing
- 📎 **File Uploads** — Attach screenshots and documents to tickets
- 🤖 **AI Chatbot** — Built-in support assistant
- 🌙 **Dark/Light Mode** — Toggle between themes
- 📱 **Responsive Design** — Mobile-friendly glassmorphism UI
- 🔔 **Toast Notifications** — Real-time feedback
- 📄 **Pagination & Filters** — Search, filter, and paginate tickets

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenAI GPT-3.5 (with mock fallback) |
| Charts | Recharts |
| File Upload | Multer |
| Email | Nodemailer |

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, upload, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # AI & email services
│   │   ├── utils/          # Seed script
│   │   └── server.js       # Entry point
│   └── uploads/            # Uploaded files
│
└── frontend/
    └── src/
        ├── components/
        │   ├── charts/     # Recharts components
        │   ├── common/     # Reusable components
        │   └── layout/     # Sidebar, Topbar, Layout
        ├── context/        # Auth & Theme context
        ├── pages/
        │   ├── admin/      # Admin-only pages
        │   └── ...         # User/Agent pages
        ├── services/       # Axios API client
        └── utils/          # Helpers & constants
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd automated-ticket-handling
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
copy .env.example .env
# Edit .env with your values (MongoDB URI, JWT secret, etc.)

# Seed demo data
node src/utils/seed.js

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Agent | agent@demo.com | password123 |
| User | user@demo.com | password123 |

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tickets | Get tickets (role-filtered) |
| POST | /api/tickets | Create ticket (AI analysis) |
| GET | /api/tickets/:id | Get single ticket |
| PUT | /api/tickets/:id | Update ticket |
| DELETE | /api/tickets/:id | Delete ticket (admin) |
| GET | /api/tickets/analytics/stats | Dashboard stats |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/messages/:ticketId | Get ticket messages |
| POST | /api/messages/:ticketId | Send message |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | Get all users |
| PUT | /api/admin/users/:id | Update user role |
| DELETE | /api/admin/users/:id | Delete user |
| GET | /api/admin/agents | Get all agents |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/chat | Chatbot response |
| POST | /api/ai/analyze | Analyze ticket text |

## 🤖 AI Configuration

The system works in two modes:

**Mock AI (default)** — Uses keyword matching, no API key needed.

**OpenAI Mode** — Set `OPENAI_API_KEY` in `.env` for GPT-3.5 powered analysis.

```env
OPENAI_API_KEY=sk-your-key-here
```

## 🌐 Deployment

### Backend (Railway/Render)

1. Push backend to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

Set `VITE_API_URL` to your deployed backend URL.

### MongoDB Atlas

1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Set `MONGO_URI` in backend `.env`

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ticket-system
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_key (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📄 License

MIT License — Free to use for personal and commercial projects.
