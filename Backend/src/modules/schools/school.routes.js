import express from 'express';
import  SchoolService  from './school.controller.js';
import authMiddleware from '../../@core/middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school
 *     description: Add a new school to the system. All fields are required.
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - district
 *               - city
 *               - lat
 *               - lng
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Royal College"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Colombo 01"
 *               district:
 *                 type: string
 *                 example: "Colombo"
 *               city:
 *                 type: string
 *                 example: "Colombo 07"
 *               lat:
 *                 type: number
 *                 example: 6.9271
 *               lng:
 *                 type: number
 *                 example: 79.8612
 *     responses:
 *       201:
 *         description: School created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: School with this name already exists
 */
router.post('/', SchoolService.createSchool);

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools
 *     description: Retrieve a list of all schools in the system
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', SchoolService.getAllSchools);

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get school by ID
 *     description: Retrieve detailed information about a specific school
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School retrieved successfully
 *       400:
 *         description: Invalid school ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: School not found
 */
router.get('/:id', SchoolService.getSchoolById);

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update school
 *     description: Update an existing school's information. At least one field must be provided.
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               district:
 *                 type: string
 *               city:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: School updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: School not found
 *       409:
 *         description: School with this name already exists
 */
router.put('/:id', SchoolService.updateSchool);

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete school
 *     description: Remove a school from the system
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       400:
 *         description: Invalid school ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: School not found
 */
router.delete('/:id', SchoolService.deleteSchool);

/**
 * @swagger
 * /api/schools/city/{city}:
 *   get:
 *     summary: Get schools by city
 *     description: Retrieve all schools located in a specific city
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *     responses:
 *       200:
 *         description: Schools retrieved successfully
 *       400:
 *         description: City name is required
 *       401:
 *         description: Unauthorized
 */
router.get('/city/:city', SchoolService.getSchoolsByCity);

/**
 * @swagger
 * /api/schools/district/kalutara:
 *   get:
 *     summary: Get schools by district
 *     description: Retrieve all schools located in a specific district
 *     tags:
 *       - Schools
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: district
 *         required: true
 *         schema:
 *           type: string
 *         description: District name
 *     responses:
 *       200:
 *         description: Schools retrieved successfully
 *       400:
 *         description: District name is required
 *       401:
 *         description: Unauthorized
 */
router.get('/district/:district', SchoolService.getSchoolsByDistrict);

export default router;