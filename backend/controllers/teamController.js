import Team from '../models/Team.js';
import User from '../models/User.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

const createResponse = (success, data = null, message = null) => ({
  success,
  data,
  message
});

export const teamController = {
  async getAllTeams(req, res) {
    try {
      let teams;
      if (req.user.role === 'Manager') {
        // Managers can see all teams they own
        teams = await Team.find({ owner: req.user.id, isActive: true })
          .populate('owner', 'name email')
          .populate('members.user', 'name email');
      } else {
        // Employees can only see teams they belong to
        teams = await Team.find({ 
          'members.user': req.user.id, 
          isActive: true 
        })
          .populate('owner', 'name email')
          .populate('members.user', 'name email');
      }
      res.json(createResponse(true, teams));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getTeamById(req, res) {
    try {
      const team = await Team.findById(req.params.id)
        .populate('owner', 'name email')
        .populate('members.user', 'name email');
      if (!team) {
        return res.status(404).json(createErrorResponse('Team not found', ErrorCodes.NOT_FOUND));
      }
      res.json(createResponse(true, team));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async createTeam(req, res) {
    try {
      // Only managers can create teams
      if (req.user.role !== 'Manager') {
        return res.status(403).json(createErrorResponse('Only managers can create teams', ErrorCodes.FORBIDDEN));
      }
      
      const teamData = {
        ...req.body,
        owner: req.user.id,
        members: [{ user: req.user.id, role: 'Manager' }]
      };
      const newTeam = await Team.create(teamData);
      await newTeam.populate('owner', 'name email');
      await newTeam.populate('members.user', 'name email');
      res.status(201).json(createResponse(true, newTeam));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async updateTeam(req, res) {
    try {
      const updatedTeam = await Team.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      ).populate('owner', 'name email').populate('members.user', 'name email');
      if (!updatedTeam) {
        return res.status(404).json(createErrorResponse('Team not found', ErrorCodes.NOT_FOUND));
      }
      res.json(createResponse(true, updatedTeam));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async addMember(req, res) {
    try {
      // Only managers can add members
      if (req.user.role !== 'Manager') {
        return res.status(403).json(createErrorResponse('Only managers can add team members', ErrorCodes.FORBIDDEN));
      }
      
      const { userId, role = 'Member' } = req.body;
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json(createErrorResponse('Team not found', ErrorCodes.NOT_FOUND));
      }
      
      // Check if manager owns this team
      if (team.owner.toString() !== req.user.id) {
        return res.status(403).json(createErrorResponse('Only team owner can add members', ErrorCodes.FORBIDDEN));
      }
      
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(createErrorResponse('User not found', ErrorCodes.NOT_FOUND));
      }
      
      // Check if already member
      const existingMember = team.members.find(member => member.user.toString() === userId);
      if (existingMember) {
        return res.status(400).json(createErrorResponse('User already a member', ErrorCodes.VALIDATION_ERROR));
      }
      
      team.members.push({ user: userId, role });
      await team.save();
      await team.populate('owner', 'name email');
      await team.populate('members.user', 'name email');
      
      res.json(createResponse(true, team));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async deleteTeam(req, res) {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json(createErrorResponse('Team not found', ErrorCodes.NOT_FOUND));
      }
      
      // Check if user is owner or admin
      if (team.owner.toString() !== req.user.id) {
        return res.status(403).json(createErrorResponse('Not authorized to delete this team', ErrorCodes.FORBIDDEN));
      }
      
      await Team.findByIdAndDelete(req.params.id);
      res.json(createResponse(true, null, 'Team deleted successfully'));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async removeMember(req, res) {
    try {
      const { id: teamId, userId } = req.params;
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json(createErrorResponse('Team not found', ErrorCodes.NOT_FOUND));
      }
      
      // Remove member from team
      team.members = team.members.filter(member => member.user.toString() !== userId);
      await team.save();
      await team.populate('owner', 'name email');
      await team.populate('members.user', 'name email');
      
      res.json(createResponse(true, team));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getTeamMembers(req, res) {
    try {
      const team = await Team.findById(req.params.id)
        .populate('members.user', 'name email role');
      if (!team) {
        return res.status(404).json(createErrorResponse('Team not found', ErrorCodes.NOT_FOUND));
      }
      
      // Only return members who are employees (not managers)
      const employees = team.members.filter(member => member.user.role === 'Member');
      res.json(createResponse(true, employees));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  }
};