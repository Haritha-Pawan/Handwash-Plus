/**
 * Unit Tests: School Controller
 * Tests each controller method by mocking SchoolRepository and DTOs.
 * All HTTP I/O is simulated via mock req/res objects.
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// ─── Mock dependencies BEFORE importing the controller ───────────────────────

jest.unstable_mockModule('../school.repository.js', () => ({
  SchoolRepository: {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    findByCity: jest.fn(),
    findByDistrict: jest.fn(),
  },
}));

jest.unstable_mockModule('../dto/create-school.dto.js', () => ({
  default: jest.fn().mockImplementation((data) => data),
  CreateSchoolDTO: jest.fn().mockImplementation((data) => data),
}));

jest.unstable_mockModule('../dto/update-school.dto.js', () => ({
  default: jest.fn().mockImplementation((data) => ({
    ...data,
    hasUpdates: () => true,
    getUpdateData: () => data,
  })),
  UpdateSchoolDTO: jest.fn().mockImplementation((data) => ({
    ...data,
    hasUpdates: () => true,
    getUpdateData: () => data,
  })),
}));

jest.unstable_mockModule('../dto/school-response.dto.js', () => ({
  default: class SchoolResponseDTO {
    constructor(school) { Object.assign(this, school); }
    static fromArray(schools) { return schools; }
  },
  SchoolResponseDTO: class SchoolResponseDTO {
    constructor(school) { Object.assign(this, school); }
    static fromArray(schools) { return schools; }
  },
}));

jest.unstable_mockModule('../school.validation.js', () => ({
  createSchoolSchema: { validate: jest.fn(() => ({ error: null })) },
  updateSchoolSchema: { validate: jest.fn(() => ({ error: null })) },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const sampleSchool = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e1',
  name: 'Greenwood Primary',
  address: '10 Forest Road',
  district: 'Westlands',
  city: 'Nairobi',
  lat: -1.2921,
  lng: 36.8219,
  createdBy: '64a1b2c3d4e5f6a7b8c9d0e2',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('School Controller — Unit Tests', () => {
  let SchoolController;
  let SchoolRepository;
  let createSchoolSchema;
  let updateSchoolSchema;

  beforeEach(async () => {
    // Dynamically import after mocks are in place
    const controllerModule = await import('../school.controller.js');
    SchoolController = controllerModule.SchoolController;

    const repoModule = await import('../school.repository.js');
    SchoolRepository = repoModule.SchoolRepository;

    const validationModule = await import('../school.validation.js');
    createSchoolSchema = validationModule.createSchoolSchema;
    updateSchoolSchema = validationModule.updateSchoolSchema;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── createSchool ────────────────────────────────────────────────────────────

  describe('createSchool()', () => {
    it('should return 201 and created school on success', async () => {
      SchoolRepository.create.mockResolvedValue(sampleSchool);

      const req = { body: { ...sampleSchool }, user: { _id: 'userId123' } };
      const res = mockRes();

      await SchoolController.createSchool(req, res);

      expect(SchoolRepository.create).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: 'School created successfully' })
      );
    });

    it('should return 400 when Joi validation fails', async () => {
      createSchoolSchema.validate.mockReturnValueOnce({
        error: { details: [{ message: '"name" is required' }] },
      });

      const req = { body: {}, user: { _id: 'userId123' } };
      const res = mockRes();

      await SchoolController.createSchool(req, res);

      expect(SchoolRepository.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 409 on duplicate school name', async () => {
      SchoolRepository.create.mockRejectedValue({ code: 11000 });

      const req = { body: { ...sampleSchool }, user: { _id: 'userId123' } };
      const res = mockRes();

      await SchoolController.createSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'School with this name already exists' })
      );
    });

    it('should return 500 on unexpected server error', async () => {
      SchoolRepository.create.mockRejectedValue(new Error('DB connection lost'));

      const req = { body: { ...sampleSchool }, user: { _id: 'userId123' } };
      const res = mockRes();

      await SchoolController.createSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── getAllSchools ────────────────────────────────────────────────────────────

  describe('getAllSchools()', () => {
    it('should return 200 with an array of schools', async () => {
      SchoolRepository.findAll.mockResolvedValue([sampleSchool]);

      const req = {};
      const res = mockRes();

      await SchoolController.getAllSchools(req, res);

      expect(SchoolRepository.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: expect.any(Array) })
      );
    });

    it('should return an empty array when there are no schools', async () => {
      SchoolRepository.findAll.mockResolvedValue([]);

      const req = {};
      const res = mockRes();

      await SchoolController.getAllSchools(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on database error', async () => {
      SchoolRepository.findAll.mockRejectedValue(new Error('DB error'));

      const req = {};
      const res = mockRes();

      await SchoolController.getAllSchools(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── getSchoolById ────────────────────────────────────────────────────────────

  describe('getSchoolById()', () => {
    it('should return 200 with the school when found', async () => {
      SchoolRepository.findById.mockResolvedValue(sampleSchool);

      const req = { params: { id: sampleSchool._id } };
      const res = mockRes();

      await SchoolController.getSchoolById(req, res);

      expect(SchoolRepository.findById).toHaveBeenCalledWith(sampleSchool._id);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when school is not found', async () => {
      SchoolRepository.findById.mockResolvedValue(null);

      const req = { params: { id: 'nonexistent-id' } };
      const res = mockRes();

      await SchoolController.getSchoolById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'School not found' })
      );
    });

    it('should return 400 on invalid MongoDB ID format', async () => {
      SchoolRepository.findById.mockRejectedValue(
        Object.assign(new Error('Cast error'), { name: 'CastError' })
      );

      const req = { params: { id: 'bad-id-format' } };
      const res = mockRes();

      await SchoolController.getSchoolById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when no id is provided', async () => {
      const req = { params: {} };
      const res = mockRes();

      await SchoolController.getSchoolById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ── updateSchool ─────────────────────────────────────────────────────────────

  describe('updateSchool()', () => {
    it('should return 200 with updated school on success', async () => {
      const updated = { ...sampleSchool, name: 'Greenwood Updated' };
      SchoolRepository.update.mockResolvedValue(updated);

      const req = {
        params: { id: sampleSchool._id },
        body: { name: 'Greenwood Updated' },
      };
      const res = mockRes();

      await SchoolController.updateSchool(req, res);

      expect(SchoolRepository.update).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when school to update is not found', async () => {
      SchoolRepository.update.mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent' },
        body: { name: 'X' },
      };
      const res = mockRes();

      await SchoolController.updateSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 when validation fails', async () => {
      updateSchoolSchema.validate.mockReturnValueOnce({
        error: { details: [{ message: '"name" must be at least 2 characters' }] },
      });

      const req = { params: { id: sampleSchool._id }, body: { name: 'X' } };
      const res = mockRes();

      await SchoolController.updateSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 409 on duplicate name conflict', async () => {
      SchoolRepository.update.mockRejectedValue({ code: 11000 });

      const req = {
        params: { id: sampleSchool._id },
        body: { name: 'Existing School' },
      };
      const res = mockRes();

      await SchoolController.updateSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  // ── deleteSchool ─────────────────────────────────────────────────────────────

  describe('deleteSchool()', () => {
    it('should return 200 on successful deletion', async () => {
      SchoolRepository.deleteById.mockResolvedValue(sampleSchool);

      const req = { params: { id: sampleSchool._id }, user: { role: 'superAdmin' } };
      const res = mockRes();

      await SchoolController.deleteSchool(req, res);

      expect(SchoolRepository.deleteById).toHaveBeenCalledWith(sampleSchool._id);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when school not found', async () => {
      SchoolRepository.deleteById.mockResolvedValue(null);

      const req = { params: { id: 'no-such-school' }, user: { role: 'superAdmin' } };
      const res = mockRes();

      await SchoolController.deleteSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 when no id is provided', async () => {
      const req = { params: {}, user: { role: 'superAdmin' } };
      const res = mockRes();

      await SchoolController.deleteSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 on invalid ID format (CastError)', async () => {
      SchoolRepository.deleteById.mockRejectedValue(
        Object.assign(new Error('Cast error'), { name: 'CastError' })
      );

      const req = { params: { id: 'bad-id' }, user: { role: 'superAdmin' } };
      const res = mockRes();

      await SchoolController.deleteSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ── getSchoolsByCity ──────────────────────────────────────────────────────────

  describe('getSchoolsByCity()', () => {
    it('should return 200 with schools in a city', async () => {
      SchoolRepository.findByCity.mockResolvedValue([sampleSchool]);

      const req = { params: { city: 'Nairobi' } };
      const res = mockRes();

      await SchoolController.getSchoolsByCity(req, res);

      expect(SchoolRepository.findByCity).toHaveBeenCalledWith('Nairobi');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when city param is missing', async () => {
      const req = { params: {} };
      const res = mockRes();

      await SchoolController.getSchoolsByCity(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ── getSchoolsByDistrict ──────────────────────────────────────────────────────

  describe('getSchoolsByDistrict()', () => {
    it('should return 200 with schools in a district', async () => {
      SchoolRepository.findByDistrict.mockResolvedValue([sampleSchool]);

      const req = { params: { district: 'Westlands' } };
      const res = mockRes();

      await SchoolController.getSchoolsByDistrict(req, res);

      expect(SchoolRepository.findByDistrict).toHaveBeenCalledWith('Westlands');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when district param is missing', async () => {
      const req = { params: {} };
      const res = mockRes();

      await SchoolController.getSchoolsByDistrict(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
