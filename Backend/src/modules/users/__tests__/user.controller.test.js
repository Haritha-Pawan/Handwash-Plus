/**
 * Unit Tests: User Controller
 * Tests all CRUD endpoints using mock req/res and mocked User model.
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// ─── Mock User model ──────────────────────────────────────────────────────────

jest.unstable_mockModule('../user.model.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// ─── Mock bcryptjs ────────────────────────────────────────────────────────────

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    compare: jest.fn(),
    hash: jest.fn().mockResolvedValue('hashed_pw'),
  },
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed_pw'),
}));

// ─── Mock jsonwebtoken ────────────────────────────────────────────────────────

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
    verify: jest.fn(),
  },
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn(),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const sampleUser = {
  _id: 'user123',
  name: 'Bob Teacher',
  email: 'bob@school.com',
  role: 'teacher',
  school: 'school456',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('User Controller — Unit Tests', () => {
  let registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser;
  let User, bcrypt, jwt;

  beforeEach(async () => {
    const userModule = await import('../user.controller.js');
    registerUser = userModule.registerUser;
    loginUser = userModule.loginUser;
    getAllUsers = userModule.getAllUsers;
    getUserById = userModule.getUserById;
    updateUser = userModule.updateUser;
    deleteUser = userModule.deleteUser;

    const userModelModule = await import('../user.model.js');
    User = userModelModule.default;

    const bcryptModule = await import('bcryptjs');
    bcrypt = bcryptModule.default;

    const jwtModule = await import('jsonwebtoken');
    jwt = jwtModule.default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── registerUser ─────────────────────────────────────────────────────────────

  describe('registerUser()', () => {
    it('should create a new user and return 201', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(sampleUser);

      const req = {
        body: { name: 'Bob Teacher', email: 'bob@school.com', password: 'Pass123!', role: 'teacher' },
      };
      const res = mockRes();

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'bob@school.com' });
      expect(User.create).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User registered successfully' })
      );
    });

    it('should return 400 when email is already taken', async () => {
      User.findOne.mockResolvedValue(sampleUser);

      const req = { body: { email: 'bob@school.com', password: 'Pass123!', role: 'teacher' } };
      const res = mockRes();

      await registerUser(req, res);

      expect(User.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Email already exists' })
      );
    });

    it('should return 500 on DB error', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));

      const req = { body: { email: 'bob@school.com', password: 'Pass123!', role: 'teacher' } };
      const res = mockRes();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── loginUser ─────────────────────────────────────────────────────────────────

  describe('loginUser()', () => {
    it('should return 200 with token on valid credentials', async () => {
      const userWithPassword = { ...sampleUser, password: 'hashed_pw' };
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(userWithPassword),
      });
      bcrypt.compare.mockResolvedValue(true);
      process.env.JWT_SECRET = 'test_secret';

      const req = { body: { email: 'bob@school.com', password: 'Pass123!' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Login successful' })
      );
    });

    it('should return 400 when user is not found', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null),
      });

      const req = { body: { email: 'unknown@school.com', password: 'Pass123!' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid email or password' })
      );
    });

    it('should return 400 when password does not match', async () => {
      const userWithPassword = { ...sampleUser, password: 'hashed_pw' };
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(userWithPassword),
      });
      bcrypt.compare.mockResolvedValue(false);

      const req = { body: { email: 'bob@school.com', password: 'WrongPass' } };
      const res = mockRes();

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid email or password' })
      );
    });
  });

  // ── getAllUsers ───────────────────────────────────────────────────────────────

  describe('getAllUsers()', () => {
    it('should return 200 with all users', async () => {
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([sampleUser]),
      });

      const req = {};
      const res = mockRes();

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ _id: 'user123' })]));
    });

    it('should return 500 on DB error', async () => {
      User.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      const req = {};
      const res = mockRes();

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── getUserById ───────────────────────────────────────────────────────────────

  describe('getUserById()', () => {
    it('should return 200 with a single user', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(sampleUser),
      });

      const req = { params: { id: 'user123' } };
      const res = mockRes();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: 'user123' }));
    });

    it('should return 404 when user is not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const req = { params: { id: 'nonexistent' } };
      const res = mockRes();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User not found' })
      );
    });
  });

  // ── updateUser ────────────────────────────────────────────────────────────────

  describe('updateUser()', () => {
    it('should return 200 with updated user', async () => {
      const updatedUser = { ...sampleUser, name: 'Bob Updated' };
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUser),
      });

      const req = { params: { id: 'user123' }, body: { name: 'Bob Updated' } };
      const res = mockRes();

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User updated successfully' })
      );
    });

    it('should return 404 when user does not exist', async () => {
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const req = { params: { id: 'missing-id' }, body: { name: 'X' } };
      const res = mockRes();

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── deleteUser ────────────────────────────────────────────────────────────────

  describe('deleteUser()', () => {
    it('should return 200 on successful deletion', async () => {
      User.findByIdAndDelete.mockResolvedValue(sampleUser);

      const req = { params: { id: 'user123' } };
      const res = mockRes();

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User deleted successfully' })
      );
    });

    it('should return 404 when user does not exist', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'missing-id' } };
      const res = mockRes();

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on DB error', async () => {
      User.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

      const req = { params: { id: 'user123' } };
      const res = mockRes();

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
