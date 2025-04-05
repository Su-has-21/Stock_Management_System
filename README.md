# Stock Management System

A full-stack web application for managing stock inventory, built with React, Express, and MySQL.

## Features

- User authentication and authorization
- Stock inventory management
- CSV import/export functionality
- Real-time stock updates
- Responsive Material-UI based interface

## Tech Stack

### Frontend
- React 19
- Material-UI
- TailwindCSS
- Axios for API calls
- React Router for navigation
- Vite for build tooling

### Backend
- Node.js with Express
- MySQL database
- JWT for authentication
- Multer for file uploads
- CSV parser for data import/export

## Project Structure

```
stock-management/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
└── backend/           # Node.js backend server
    ├── config/        # Configuration files
    ├── database/      # Database setup and models
    ├── middleware/    # Custom middleware
    ├── routes/        # API routes
    └── package.json   # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up the database:
```bash
cd ../backend
npm run setup
```

5. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the database credentials and other settings

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run setup` - Set up the database

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 
