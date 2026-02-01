import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { createErrorResponse, ErrorCodes } from '../utils/errors.js';

const createResponse = (success, data = null, message = null) => ({
  success,
  data,
  message
});

export const authController = {
  async login(req, res) {
    try {
      const { email, password, role } = req.body;
      
      if (!email || !password) {
        return res.status(400).json(createErrorResponse(
          'Email and password required',
          ErrorCodes.VALIDATION_ERROR
        ));
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password)) || user.role !== role) {
        return res.status(401).json(createErrorResponse(
          'Invalid credentials',
          ErrorCodes.UNAUTHORIZED
        ));
      }

      const token = generateToken({ id: user._id, email: user.email, role: user.role });
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      res.json(createResponse(true, {
        user: userResponse,
        token
      }));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  },

  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password || !role) {
        return res.status(400).json(createErrorResponse(
          'All fields required',
          ErrorCodes.VALIDATION_ERROR
        ));
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json(createErrorResponse(
          'Email already exists',
          ErrorCodes.DUPLICATE_RESOURCE
        ));
      }

      const newUser = await User.create({ name, email, password, role });
      const token = generateToken({ id: newUser._id, email: newUser.email, role: newUser.role });
      const userResponse = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };

      res.status(201).json(createResponse(true, {
        user: userResponse,
        token
      }));
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', ErrorCodes.INTERNAL_ERROR));
    }
  }
};