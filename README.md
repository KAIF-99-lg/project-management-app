<<<<<<< HEAD
# project-management-app
=======
# 🚀 Project Management Web App

A modern, full-stack project management system with role-based access control, built with React, Node.js, and MongoDB.

## ✨ Features

### 👨‍💼 Manager Features
- **Team Management**: Create teams and manage members
- **Project Management**: Create projects and assign to teams
- **Task Management**: Structured assignment workflow (Team → Project → Member)
- **Dashboard**: Overview of all managed resources with analytics
- **Detailed Views**: Comprehensive project and task details

### 👨‍💻 Employee Features
- **Team Access**: View assigned teams and members
- **Project Viewing**: Access team projects with detailed information
- **Task Management**: View assigned tasks and update status
- **Multi-team Support**: Belong to multiple teams simultaneously
- **Personal Dashboard**: Task overview and progress tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcrypt** for password hashing
- **Role-based middleware** for authorization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Project Management Web App"
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Setup**
Create `.env` file in backend directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your-secret-key
```

4. **Start the application**
```bash
# Option 1: Use the batch script (Windows)
start-system.bat

# Option 2: Manual start
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Project Structure

```
Project Management Web App/
├── backend/                 # Node.js API server
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & authorization
│   └── server.js          # Entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── pages/      # Page components
│   │   │   └── routes.tsx  # Route configuration
│   │   ├── context/       # React context
│   │   └── services/      # API services
│   └── vite.config.ts     # Vite configuration
└── README.md
```

## 🔐 Authentication & Authorization

### User Roles
- **Manager**: Full CRUD operations on teams, projects, and tasks
- **Employee**: View assigned data and update task status

### Access Control
- JWT-based authentication
- Role-based route protection
- Data isolation by user assignments
- Secure API endpoints

## 📊 Core Workflow

1. **Manager creates teams** and adds employees
2. **Manager creates projects** and assigns to teams
3. **Manager creates tasks** following structured workflow:
   - Select Team → Select Project → Assign to Member
4. **Employees view assignments** and update task progress
5. **Real-time tracking** across the system

## 🎯 Task Status Flow

```
To Do → In Progress → In Review → Done
```

Employees can update their task status through the interface.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/manager/login`
- `POST /api/auth/member/login`

### Teams
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create team (Manager only)
- `GET /api/teams/:id/members` - Get team members

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project (Manager only)
- `GET /api/projects/:id` - Get project details

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task (Manager only)
- `PUT /api/tasks/:id` - Update task
- `GET /api/tasks/my-tasks` - Get assigned tasks (Employee)

## 🚧 Development

### Running in Development Mode
```bash
# Backend with nodemon
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend is ready for production as-is
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ for efficient project management**
>>>>>>> 2c05e4b (Initial commit: Project Management Web App)
