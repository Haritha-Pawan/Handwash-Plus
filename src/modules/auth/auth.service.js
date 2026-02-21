import { UserRepository } from '../users/user.repository.js';
import { comparePassword, hashPassword } from '../../@core/utils/password.util.js';
import { generateTokens, verifyToken, generateResetToken } from '../../@core/utils/jwt.util.js';
import { ROLES } from '../../@core/constants/roles.constants.js';

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Save refresh token
    await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

    return { user, tokens };
  }

  async login(email, password) {
    // Find user with password
    const user = await this.userRepository.findByEmail(email, true);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.isBlocked) {
      throw new Error('Account is blocked. Please contact admin');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await this.userRepository.update(user._id, { lastLogin: new Date() });

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Save refresh token
    await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

    // Remove password from response
    user.password = undefined;

    return { user, tokens };
  }

  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken, true);
      
      // Find user with refresh token
      const user = await this.userRepository.findById(decoded.userId, true);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      // Update refresh token
      await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId) {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.userRepository.findById(userId, true);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date()
    });

    return true;
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists or not
      return true;
    }

    // Generate reset token
    const resetToken = generateResetToken(user._id);

    // Save reset token (you'd typically save this to user model)
    await this.userRepository.update(user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: new Date(Date.now() + 3600000) // 1 hour
    });

    // Here you would send email with reset token
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return true;
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = verifyToken(token);
      
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user || user.passwordResetToken !== token) {
        throw new Error('Invalid or expired reset token');
      }

      if (user.passwordResetExpires < new Date()) {
        throw new Error('Reset token has expired');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await this.userRepository.update(user._id, {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        passwordResetToken: null,
        passwordResetExpires: null
      });

      return true;
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  async validateSchoolAccess(userId, schoolId) {
    const user = await this.userRepository.findById(userId);
    
    if (!user) return false;
    
    // Super admin can access all schools
    if (user.role === ROLES.SUPER_ADMIN) return true;
    
    // Check if user belongs to the school
    return user.schoolId.toString() === schoolId.toString();
  }
}