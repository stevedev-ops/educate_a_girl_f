# NGO Project

This project matches a React frontend with a Node.js/Express backend to create a full platform for the NGO.

## Project Structure

- **frontend/**: React application built with Vite (folder: `educate_a_girl_f`).
- **backend/**: Node.js Express server using PostgreSQL database (folder: `Eduacate_A_GIRL-b`).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup & Installation

### 1. Backend Setup

The backend handles the API and database.

```bash
cd Eduacate_A_GIRL-b
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
cd educate_a_girl_f
# Install dependencies (use --legacy-peer-deps to resolve react-paystack conflict)
npm install --legacy-peer-deps
```

## Running the Application

You need to run both the backend and frontend simultaneously (in separate terminal windows).

### Start Backend

Runs on `http://localhost:3001`

```bash
cd ../Eduacate_A_GIRL-b
node index.js
```
*(Note: The main entry point is `index.js`, not `server.js`)*

### Start Frontend

Runs on `http://localhost:5173` (typically)

```bash
cd ../educate_a_girl_f
npm run dev
```

**Troubleshooting Startup (Windows/WSL Users):**
If you encounter `\r: command not found` or `env: node\r: No such file or directory` errors when running `npm run dev`, it is due to Windows line endings in the `node_modules/.bin` scripts. You can bypass this by running the Vite script directly with Node:

```bash
node node_modules/vite/bin/vite.js
```

## API Verification

You can verify the backend endpoints are working correctly by running the verification script in the backend directory:

```bash
cd Eduacate_A_GIRL-b
node verify_all_endpoints.js
```

## Troubleshooting

- **Database Errors**: If you see "no such table" errors, make sure you ran `node seed.js` in the backend folder.
- **Frontend Dependencies**: If `npm install` fails in the frontend, ensure you are using `--legacy-peer-deps`.
- **Port Conflicts**: Ensure ports 3001 (backend) and 5173 (frontend) are free.
