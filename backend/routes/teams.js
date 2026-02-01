import express from 'express';
import { teamController } from '../controllers/teamController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, teamController.getAllTeams);
router.get('/:id', authenticateToken, teamController.getTeamById);
router.get('/:id/members', authenticateToken, teamController.getTeamMembers);
router.post('/', authenticateToken, teamController.createTeam);
router.put('/:id', authenticateToken, teamController.updateTeam);
router.delete('/:id', authenticateToken, teamController.deleteTeam);
router.post('/:id/members', authenticateToken, teamController.addMember);
router.delete('/:id/members/:userId', authenticateToken, teamController.removeMember);

export { router as teamRoutes };