import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'NexaMeet-JWT-Secret-Key-2026';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Generate JWT authentication token for a user
   */
  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verify JWT token and return payload
   */
  static verifyToken(token: string): { id: string } {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  }

  /**
   * Register a new user account
   */
  static async register(name: string, email: string, password: string): Promise<{ user: Partial<IUserDocument>; token: string }> {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    const token = this.generateToken((user._id as any).toString());

    return {
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      } as any,
      token
    };
  }

  /**
   * Authenticate user with email and password
   */
  static async login(email: string, password: string): Promise<{ user: Partial<IUserDocument>; token: string }> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken((user._id as any).toString());

    return {
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      } as any,
      token
    };
  }
}
