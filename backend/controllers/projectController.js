import Project from '../models/Project.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

const createResponse = (success, data = null, message = null) => ({
  success,
  data,
  message
});

export const projectController = {
  async getAllProjects(req, res) {
    try {
      let projects;
      if (req.user.role === 'Manager') {
        // Managers can see all projects they own
        projects = await Project.find({ owner: req.user.id })
          .populate('team', 'name')
          .populate('owner', 'name email');
      } else {
        // Employees can only see projects assigned to their teams
        const userTeams = await Team.find({ 'members.user': req.user.id }).select('_id');
        const teamIds = userTeams.map(team => team._id);
        projects = await Project.find({ team: { $in: teamIds } })
          .populate('team', 'name')
          .populate('owner', 'name email');
      }
      res.json(createResponse(true, projects));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getProjectById(req, res) {
    try {
      const project = await Project.findById(req.params.id)
        .populate('team', 'name')
        .populate('owner', 'name email');
      if (!project) {
        return res.status(404).json(createErrorResponse('Project not found', ErrorCodes.NOT_FOUND));
      }
      res.json(createResponse(true, project));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async createProject(req, res) {
    try {
      // Only managers can create projects
      if (req.user.role !== 'Manager') {
        return res.status(403).json(createErrorResponse('Only managers can create projects', ErrorCodes.FORBIDDEN));
      }
      
      const projectData = {
        ...req.body,
        owner: req.user.id
      };
      const newProject = await Project.create(projectData);
      await newProject.populate('team', 'name');
      await newProject.populate('owner', 'name email');
      res.status(201).json(createResponse(true, newProject));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async updateProject(req, res) {
    try {
      // Only managers can update projects
      if (req.user.role !== 'Manager') {
        return res.status(403).json(createErrorResponse('Only managers can update projects', ErrorCodes.FORBIDDEN));
      }
      
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json(createErrorResponse('Project not found', ErrorCodes.NOT_FOUND));
      }
      
      // Check if manager owns this project
      if (project.owner.toString() !== req.user.id) {
        return res.status(403).json(createErrorResponse('Only project owner can update project', ErrorCodes.FORBIDDEN));
      }
      
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      ).populate('team', 'name').populate('owner', 'name email');
      
      res.json(createResponse(true, updatedProject));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async deleteProject(req, res) {
    try {
      const deleted = await Project.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json(createErrorResponse('Project not found', ErrorCodes.NOT_FOUND));
      }
      res.json(createResponse(true, null, 'Project deleted successfully'));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  }
};