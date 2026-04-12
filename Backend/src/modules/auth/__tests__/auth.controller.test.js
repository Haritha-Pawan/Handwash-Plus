/**
 * Unit Tests: Auth Controller
 * Tests register and login endpoints using mock req/res and mocked dependencies.
 */

import { jest, describe, it, expect, beforeAll, afterEach } from '@jest/globals';

// ─── Mock User model ──────────────────────────────────────────────────────────

jest.unstable_mockModule('../../users/user.model.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// ─── Mock AuthService — keep a shared spy for the login method ────────────────

const loginSpy = jest.fn();

jest.unstable_mockModule('../auth.service.js', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: loginSpy,
  })),
}));

// ─── Mock jwt utils ───────────────────────────────────────────────────────────

jest.unstable_mockModule('../../../@core/utils/jwt.utils.js', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn(),
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  generateResetToken: jest.fn(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Auth Controller — Unit Tests', () => {
  let registerUser, loginUser;
  let User, hashPassword;

  // Import once — ESM caches modules; authService is created at import time
  beforeAll(async () => {
    const authModule = await import('../auth.controller.js');
    registerUser = authModule.registerUser;
    loginUser = authModule.loginUser;

    const userModelModule = await import('../../users/user.model.js');
    User = userModelModule.default;

    const jwtModule = await import('../../../@core/utils/jwt.utils.js');
    hashPassword = jwtModule.hashPassword;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── registerUser ─────────────────────────────────────────────────────────────

  describe('registerUser()', () => {
    const validBody = {
      name: 'Alice Admin',
      email: 'alice@school.com',
      password: 'Password123!',
      role: 'admin',
    };

    it('should return 201 on successful registration', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'user123',
        name: 'Alice Admin',
        email: 'alice@school.com',
        role: 'admin',
      });

      const req = { body: { ...validBody } };
      const res = mockRes();

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: validBody.email });
      expect(hashPassword).toHaveBeenCalledWith(validBody.password);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User registered successfully' })
      );
    });

    it('should return 400 when email already exists', async () => {
      User.findOne.mockResolvedValue({ _id: 'existing', email: 'alice@school.com' });

      const req = { body: { ...validBody } };
      const res = mockRes();

      await registerUser(req, res);

      expect(User.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User already exists' })
      );
    });

    it('should return 500 on unexpected DB error', async () => {
      User.findOne.mockRejectedValue(new Error('DB connection failed'));

      const req = { body: { ...validBody } };
      const res = mockRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── loginUser ─────────────────────────────────────────────────────────────────

  describe('loginUser()', () => {
    it('should return 400 when email is missing', async () => {
      const req = { body: { password: 'Password123!' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Email and password are required' })
      );
    });

    it('should return 400 when password is missing', async () => {
      const req = { body: { email: 'alice@school.com' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Email and password are required' })
      );
    });

    it('should return 200 with user and tokens on valid login', async () => {
      loginSpy.mockResolvedValueOnce({
        user: { _id: 'user123', name: 'Alice', email: 'alice@school.com', role: 'admin' },
        tokens: { accessToken: 'token123', refreshToken: 'refresh456' },
      });

      const req = { body: { email: 'alice@school.com', password: 'Password123!' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(loginSpy).toHaveBeenCalledWith('alice@school.com', 'Password123!');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Login successful' })
      );
    });

    it('should return 401 on invalid credentials', async () => {
      loginSpy.mockRejectedValueOnce(new Error('Invalid email or password'));

      const req = { body: { email: 'wrong@school.com', password: 'wrongpass' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid email or password' })
      );
    });

    it('should return 401 when account is blocked', async () => {
      loginSpy.mockRejectedValueOnce(new Error('Account is blocked. Please contact admin'));

      const req = { body: { email: 'blocked@school.com', password: 'Pass123!' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
