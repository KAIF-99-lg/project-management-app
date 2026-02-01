# Backend Folder Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js         # Database configuration
│   └── environment.js      # Environment variables
│
├── constants/              # Application constants
│   ├── taskStatus.js       # Task status definitions
│   ├── userRoles.js        # User role definitions
│   └── priorities.js       # Priority levels
│
├── controllers/            # Business logic controllers
│   ├── authController.js   # Authentication logic
│   ├── dashboardController.js # Dashboard data logic
│   ├── taskController.js   # Task management logic
│   ├── projectController.js # Project management logic
│   ├── teamController.js   # Team management logic
│   └── analyticsController.js # Analytics logic
│
├── middleware/             # Express middleware
│   ├── auth.js            # Authentication middleware
│   ├── roles.js           # Role-based access control
│   └── validation.js      # Request validation
│
├── models/                 # Data models/schemas
│   ├── User.js            # User model
│   ├── Task.js            # Task model
│   ├── Project.js         # Project model
│   ├── Team.js            # Team model
│   └── Activity.js        # Activity log model
│
├── routes/                 # API route definitions
│   ├── auth.js            # Authentication routes
│   ├── dashboard.js       # Dashboard routes
│   ├── tasks.js           # Task routes
│   ├── projects.js        # Project routes
│   ├── teams.js           # Team routes
│   ├── members.js         # Member routes
│   ├── kanban.js          # Kanban board routes
│   ├── analytics.js       # Analytics routes
│   └── activity.js        # Activity log routes
│
├── services/               # Business logic services
│   ├── authService.js     # Authentication service
│   ├── taskService.js     # Task business logic
│   ├── projectService.js  # Project business logic
│   ├── teamService.js     # Team business logic
│   └── analyticsService.js # Analytics calculations
│
├── utils/                  # Utility functions
│   ├── errors.js          # Error handling utilities
│   ├── jwt.js             # JWT utilities
│   ├── pagination.js      # Pagination helpers
│   └── validators.js      # Input validation helpers
│
├── package.json           # Dependencies and scripts
├── server.js              # Express server setup
└── README.md              # API documentation
```

## Feature Alignment

**Frontend → Backend Mapping:**

- **Authentication** → `routes/auth.js`, `controllers/authController.js`
- **Dashboard** → `routes/dashboard.js`, `controllers/dashboardController.js`
- **Tasks/Kanban** → `routes/tasks.js`, `routes/kanban.js`, `controllers/taskController.js`
- **Projects** → `routes/projects.js`, `controllers/projectController.js`
- **Teams** → `routes/teams.js`, `controllers/teamController.js`
- **Analytics** → `routes/analytics.js`, `controllers/analyticsController.js`
- **Activity Logs** → `routes/activity.js`, `services/activityService.js`

## Architecture Benefits

- **Feature-based organization** matches frontend structure
- **Separation of concerns** with controllers, services, models
- **Reusable utilities** and middleware
- **Scalable structure** for adding new features
- **Clear API boundaries** aligned with frontend pages