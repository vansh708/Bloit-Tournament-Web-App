# Bloit Tournament Web App

A full-stack web application designed for organizing and participating in gaming tournaments. Built as a resume project to demonstrate advanced web technologies.

## Tech Stack
**Frontend:** React.js (Vite), Tailwind CSS, Shadcn UI / NextUI, Framer Motion, Axios, React Router, Socket.io-client.
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT Authentication, Socket.io.

## Key Features
- **User Authentication:** Secure signup/login using JSON Web Tokens (JWT) and `bcrypt` based password hashing.
- **Role-based Access:** Two separate user roles - Organizer and Player.
- **Tournament Management:** Organizers can create tournaments indicating max participants, brackets, game etc.
- **Live Search & Filters:** Find tournaments dynamically (supports debounce).
- **Responsive & Premium UI:** Designed carefully using Tailwind CSS and NextUI following modern aesthetics (glassmorphism, dark mode gradients).
- **Real-Time capabilities setup:** Basic Socket.io foundation is already setup for live chat or notifications.

## Project Structure
- `/frontend`: React application built with Vite.
- `/backend`: Node.js API to communicate with MongoDB.

## Setup Instructions

### Pre-requisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or remote/Atlas)

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file if necessary:
   Ensure `MONGODB_URI` points to a reachable MongoDB instance (default is `mongodb://127.0.0.1:27017/bloit_tournament`).
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The backend server should run on `http://localhost:5000` and the frontend app usually on `http://localhost:5173`.
