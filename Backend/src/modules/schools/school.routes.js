import express from 'express';
import SchoolService from './school.controller.js';
import authMiddleware from '../../@core/middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// School routes
router.post('/', SchoolService.createSchool);
router.get('/', SchoolService.getAllSchools);
router.get('/:id', SchoolService.getSchoolById);
router.put('/:id', SchoolService.updateSchool);
router.delete('/:id', SchoolService.deleteSchool);
router.get('/city/:city', SchoolService.getSchoolsByCity);
router.get('/district/:district', SchoolService.getSchoolsByDistrict);

export default router;