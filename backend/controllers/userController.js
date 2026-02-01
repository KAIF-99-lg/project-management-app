import User from '../models/User.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

const createResponse = (success, data = null, message = null) => ({
  success,
  data,
  message
});

export const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({ isActive: true })
        .select('-password')
        .sort({ name: 1 });
      res.json(createResponse(true, users));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json(createErrorResponse('User not found', ErrorCodes.NOT_FOUND));
      }
      res.json(createResponse(true, user));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getUserTeams(req, res) {
    try {
      const teams = await Team.find({ 
        'members.user': req.user.id,
        isActive: true 
      })
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
      
      res.json(createResponse(true, teams));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getUserProjects(req, res) {
    try {
      // First get user's teams
      const userTeams = await Team.find({ 
        'members.user': req.user.id,
        isActive: true 
      }).select('_id');
      
      const teamIds = userTeams.map(team => team._id);
      
      // Then get projects assigned to those teams
      const projects = await Project.find({ 
        team: { $in: teamIds },
        isActive: true 
      })
      .populate('team', 'name')
      .populate('owner', 'name email');
      
      res.json(createResponse(true, projects));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  }
};