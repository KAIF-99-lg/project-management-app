# Jira-like Project Management API

Production-ready backend designed for direct React/Next.js integration with minimal data transformation.

## 🚀 Quick Start

```bash
npm install
npm run dev  # Development
npm start    # Production
```

Server runs on `http://localhost:3001`

## 🔐 Authentication

**JWT-based authentication with role-based access control**

### Endpoints
- `POST /api/auth/manager/login` - Manager login
- `POST /api/auth/manager/signup` - Manager registration  
- `POST /api/auth/member/login` - Member login
- `POST /api/auth/member/signup` - Member registration

### Response Format
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "John", "email": "john@test.com", "role": "manager" },
    "token": "jwt-token-here"
  }
}
```

## 📊 Dashboard APIs

**Aggregated data for dashboard components**

- `GET /api/dashboard/manager/overview` - Complete manager dashboard
- `GET /api/dashboard/member/overview` - Complete member dashboard

## 📋 Task Management

**Kanban workflow support**

- `GET /api/kanban/boards` - Tasks grouped by status columns
- `PUT /api/kanban/tasks/:id/status` - Update task status (assigned member only)
- `POST /api/kanban/tasks` - Create new task (manager only)
- `GET /api/tasks/my-tasks` - Member's assigned tasks with pagination

### Kanban Response
```json
{
  "columns": [
    {
      "id": "todo",
      "title": "To Do",
      "count": 5,
      "tasks": [
        {
          "id": 1,
          "title": "Design homepage",
          "assignee": "John Doe",
          "priority": "high",
          "dueDate": "2024-01-20"
        }
      ]
    }
  ]
}
```

## 📈 Analytics

**Performance metrics and charts**

- `GET /api/analytics/member-progress` - Team member statistics
- `GET /api/analytics/member-charts` - Chart-ready data
- `GET /api/analytics/complete-overview` - Full analytics suite

## 👥 Team Management

**Team and member operations**

- `GET /api/teams` - All teams with member counts
- `POST /api/teams` - Create team (manager only)
- `GET /api/teams/:id/available-members` - Available members for assignment
- `POST /api/teams/:id/members` - Add member to team
- `GET /api/members` - All members with performance data

## 🏗️ Project Management

**Project lifecycle management**

- `GET /api/projects` - Projects with pagination/filtering
- `POST /api/projects` - Create project (manager only)
- `GET /api/projects/:id` - Project details

### Pagination & Filtering
```
GET /api/projects?page=1&limit=10&search=website&status=active&priority=high&sortBy=name&sortOrder=desc
```

## 📝 Activity Logs

**Human-readable activity timeline**

- `GET /api/activity/recent` - Recent activities with filtering
- `GET /api/activity/project/:id` - Project-specific activities
- `GET /api/activity/user/:id` - User activity history

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate limiting** - 100 requests per 15 minutes
- **CORS** - Configurable origins
- **JWT validation** - Secure token verification
- **Role-based access** - Manager/Member permissions
- **Data visibility** - Users only see authorized data

## 📱 Frontend Integration

**React/Next.js ready responses**

```javascript
// Direct usage - no transformation needed
const { data: projects, pagination } = await fetch('/api/projects').then(r => r.json());

// Kanban columns map directly to UI
const { columns } = await fetch('/api/kanban/boards').then(r => r.json());
columns.forEach(column => renderKanbanColumn(column));

// Error handling
try {
  const response = await apiCall();
  if (!response.success) {
    showError(response.error.message, response.error.code);
  }
} catch (error) {
  showError('Network error', 'NETWORK_ERROR');
}
```

## 🏗️ Architecture

- **Feature-aligned routes** match frontend pages
- **Lightweight payloads** for fast rendering  
- **Consistent error format** for unified error handling
- **Status constants** eliminate mapping logic
- **Aggregated endpoints** minimize API calls
- **Role-based filtering** ensures data security

## 🔧 Environment Variables

```env
PORT=3001
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

## 📊 Response Standards

**Success Response**
```json
{
  "success": true,
  "data": {...},
  "pagination": {...}  // For paginated endpoints
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error",
    "code": "ERROR_CODE",
    "details": "Optional details"
  },
  "data": null
}
```

Ready for production deployment with comprehensive security, performance optimization, and direct frontend integration.