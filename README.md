# Smart City Complaint Management System

A full-stack MERN application for managing city complaints, allowing citizens to file and track complaints while enabling administrators to manage and respond to them.

## Features

- User Authentication (JWT-based)
- Role-based Access Control (Citizen & Admin)
- Complaint Filing & Tracking
- Admin Dashboard
- Real-time Status Updates
- Responsive Design with Tailwind CSS

## Tech Stack

- MongoDB: Database
- Express.js: Backend Framework
- React: Frontend Framework
- Node.js: Runtime Environment
- Tailwind CSS: Styling
- JWT: Authentication

## Project Structure

```
smart-city-complaints/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── utils/
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── .env                    # Environment variables
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Complaints
- POST /api/complaints - Create new complaint
- GET /api/complaints - Get all complaints (admin)
- GET /api/complaints/user - Get user's complaints
- GET /api/complaints/:id - Get single complaint
- PUT /api/complaints/:id - Update complaint status (admin)
- DELETE /api/complaints/:id - Delete complaint

## License

MIT 