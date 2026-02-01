import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireManager, requireAny } from '../middleware/roles.js';

const router = express.Router();

// Mock members data (shared with teams)
let members = [
  { id: 1, name: 'John Doe', email: 'john@test.com', role: 'Lead Developer', teamId: 1, teamName: 'Frontend Team', status: 'active', joinedAt: '2024-01-01', tasksCompleted: 24, tasksActive: 3 },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com', role: 'UI Designer', teamId: 1, teamName: 'Frontend Team', status: 'active', joinedAt: '2024-01-02', tasksCompleted: 18, tasksActive: 2 },
  { id: 3, name: 'Mike Johnson', email: 'mike@test.com', role: 'Backend Developer', teamId: 2, teamName: 'Backend Team', status: 'active', joinedAt: '2024-01-05', tasksCompleted: 15, tasksActive: 4 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@test.com', role: 'QA Engineer', teamId: null, teamName: null, status: 'available', joinedAt: '2024-01-10', tasksCompleted: 8, tasksActive: 1 }
];

// Get all members (for member list)
router.get('/', authenticateToken, requireManager, (req, res) => {
  const memberList = members.map(member => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    teamName: member.teamName,
    status: member.status,
    tasksCompleted: member.tasksCompleted,
    tasksActive: member.tasksActive
  }));
  
  res.json({ members: memberList });
});

// Get member details (for member modal/profile)
router.get('/:id', authenticateToken, requireAny, (req, res) => {
  const member = members.find(m => m.id === parseInt(req.params.id));
  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }
  
  res.json({ member });
});

// Create member (for add member modal)
router.post('/', authenticateToken, requireManager, (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email and role required' });
  }
  
  if (members.find(m => m.email === email)) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }
  
  const newMember = {
    id: Date.now(),
    name,
    email,
    role,
    teamId: null,
    teamName: null,
    status: 'available',
    joinedAt: new Date().toISOString().split('T')[0],
    tasksCompleted: 0,
    tasksActive: 0
  };
  
  members.push(newMember);
  
  res.status(201).json({
    success: true,
    member: {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      teamName: newMember.teamName,
      status: newMember.status,
      tasksCompleted: newMember.tasksCompleted,
      tasksActive: newMember.tasksActive
    }
  });
});

// Update member
router.put('/:id', authenticateToken, requireManager, (req, res) => {
  const member = members.find(m => m.id === parseInt(req.params.id));
  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }
  
  const { name, email, role, status } = req.body;
  if (name) member.name = name;
  if (email) member.email = email;
  if (role) member.role = role;
  if (status) member.status = status;
  
  res.json({ success: true, member });
});

// Delete member
router.delete('/:id', authenticateToken, requireManager, (req, res) => {
  const memberIndex = members.findIndex(m => m.id === parseInt(req.params.id));
  if (memberIndex === -1) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }
  
  members.splice(memberIndex, 1);
  res.json({ success: true, message: 'Member deleted' });
});

export { router as memberRoutes };