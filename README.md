# NGO Project

This project matches a React frontend with a Node.js/Express backend to create a full platform for the NGO.

## Project Structure

- **frontend/**: React application built with Vite.
- **backend/**: Node.js Express server using SQLite database.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup & Installation

### 1. Backend Setup

The backend handles the API and database.

```bash
cd backend
npm install
```

**Database Initialization:**
Before running the server, you need to seed the database (this creates tables and adds initial data).

```bash
node seed.js
```

### 2. Frontend Setup

The frontend is the user interface.

```bash
cd frontend
# Install dependencies (use --legacy-peer-deps to resolve react-paystack conflict)
npm install --legacy-peer-deps
```

## Running the Application

You need to run both the backend and frontend simultaneously (in separate terminal windows).

### Start Backend

Runs on `http://localhost:3001`

```bash
cd backend
node server.js
```

### Start Frontend

Runs on `http://localhost:5173` (typically)

```bash
cd frontend
npm run dev
```

## API Verification

You can verify the backend endpoints are working correctly by running the verification script in the backend directory:

```bash
cd backend
node verify_all_endpoints.js
```

## Troubleshooting

- **Database Errors**: If you see "no such table" errors, make sure you ran `node seed.js` in the backend folder.
- **Frontend Dependencies**: If `npm install` fails in the frontend, ensure you are using `--legacy-peer-deps`.
- **Port Conflicts**: Ensure ports 3001 (backend) and 5173 (frontend) are free.
