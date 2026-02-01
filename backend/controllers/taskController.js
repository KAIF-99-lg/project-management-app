import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

const createResponse = (success, data = null, message = null) => ({
  success,
  data,
  message
});

export const taskController = {
  async getAllTasks(req, res) {
    try {
      let tasks;
      if (req.user.role === 'Manager') {
        // Managers can see all tasks they created
        tasks = await Task.find({ createdBy: req.user.id })
          .populate('assignedTo', 'name email')
          .populate('createdBy', 'name email')
          .populate('project', 'name');
      } else {
        // Employees can only see tasks assigned to them
        tasks = await Task.find({ assignedTo: req.user.id })
          .populate('assignedTo', 'name email')
          .populate('createdBy', 'name email')
          .populate('project', 'name');
      }
      res.json(createResponse(true, tasks));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getTaskById(req, res) {
    try {
      const task = await Task.findById(req.params.id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .populate('project', 'name')
        .populate('comments.user', 'name email');
      if (!task) {
        return res.status(404).json(createErrorResponse('Task not found', ErrorCodes.NOT_FOUND));
      }
      res.json(createResponse(true, task));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async getUserTasks(req, res) {
    try {
      const tasks = await Task.find({ assignedTo: req.user.id })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .populate('project', 'name');
      res.json(createResponse(true, tasks));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async createTask(req, res) {
    try {
      // Only managers can create tasks
      if (req.user.role !== 'Manager') {
        return res.status(403).json(createErrorResponse('Only managers can create tasks', ErrorCodes.FORBIDDEN));
      }
      
      const taskData = {
        ...req.body,
        createdBy: req.user.id
      };
      const newTask = await Task.create(taskData);
      await newTask.populate('assignedTo', 'name email');
      await newTask.populate('createdBy', 'name email');
      await newTask.populate('project', 'name');
      res.status(201).json(createResponse(true, newTask));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async updateTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json(createErrorResponse('Task not found', ErrorCodes.NOT_FOUND));
      }
      
      // Managers can update any task they created
      // Employees can only update status of tasks assigned to them
      if (req.user.role === 'Manager') {
        if (task.createdBy.toString() !== req.user.id) {
          return res.status(403).json(createErrorResponse('Only task creator can update task', ErrorCodes.FORBIDDEN));
        }
      } else {
        // Employee can only update their own task status
        if (task.assignedTo.toString() !== req.user.id) {
          return res.status(403).json(createErrorResponse('You can only update your own tasks', ErrorCodes.FORBIDDEN));
        }
        // Employees can only update status
        const allowedFields = ['status'];
        const updateFields = Object.keys(req.body);
        const isValidUpdate = updateFields.every(field => allowedFields.includes(field));
        if (!isValidUpdate) {
          return res.status(403).json(createErrorResponse('Employees can only update task status', ErrorCodes.FORBIDDEN));
        }
      }
      
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      ).populate('assignedTo', 'name email')
       .populate('createdBy', 'name email')
       .populate('project', 'name');
       
      res.json(createResponse(true, updatedTask));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async deleteTask(req, res) {
    try {
      // Only managers can delete tasks
      if (req.user.role !== 'Manager') {
        return res.status(403).json(createErrorResponse('Only managers can delete tasks', ErrorCodes.FORBIDDEN));
      }
      
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json(createErrorResponse('Task not found', ErrorCodes.NOT_FOUND));
      }
      
      // Check if manager created this task
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json(createErrorResponse('Only task creator can delete task', ErrorCodes.FORBIDDEN));
      }
      
      await Task.findByIdAndDelete(req.params.id);
      res.json(createResponse(true, null, 'Task deleted successfully'));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async addComment(req, res) {
    try {
      const { text } = req.body;
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json(createErrorResponse('Task not found', ErrorCodes.NOT_FOUND));
      }
      
      task.comments.push({ user: req.user.id, text });
      await task.save();
      await task.populate('comments.user', 'name email');
      
      res.json(createResponse(true, task));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  }
};