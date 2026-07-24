import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const { user, token } = await AuthService.register(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user
    });
  } catch (error: any) {
    res.status(400).json({ error: 'Registration failed', message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, token } = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user
    });
  } catch (error: any) {
    res.status(401).json({ error: 'Authentication failed', message: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user profile', message: error.message });
  }
};
