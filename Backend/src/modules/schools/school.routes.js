import express from 'express';
import { 
    getAllSchools, 
    getSchoolById, 
    getSchoolsByCity, 
    getSchoolsByDistrict, 
    createSchool, 
    updateSchool, 
    deleteSchool 
} from './school.controller.js';
import authMiddleware from '../../@core/middleware/auth.middleware.js';
import roleMiddleware from '../../@core/middleware/role.middlewere.js';

const router = express.Router();

// Public Routes (Allows the Dashboard Preview to fetch the map data!)
router.get('/', getAllSchools);
router.get('/:id', getSchoolById);
router.get('/city/:city', getSchoolsByCity);
router.get('/district/:district', getSchoolsByDistrict);

// Protected Routes (Strictly Super Admin Only)
router.use(authMiddleware);
router.use(roleMiddleware('superAdmin'));

router.post('/', createSchool);
router.put('/:id', updateSchool);
router.delete('/:id', deleteSchool);

export default router;