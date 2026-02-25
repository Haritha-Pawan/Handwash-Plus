import { SchoolRepository } from "./school.service.js";
import ResponseUtil from "../../@core/utils/response.util.js";

export const SchoolService = {

    createSchool: async (req, res) => {
        try {
            const schoolData = {
                ...req.body,
                createdBy: req.user._id || req.user.id
            };
            
            const school = await SchoolRepository.create(schoolData);
            return ResponseUtil.created(res, 'School created successfully', school);
        } catch (error) {
            console.error('Create school error:', error);
            return ResponseUtil.serverError(res, 'Failed to create school', error);
        }
    },

    getAllSchools: async (req, res) => {
        try {
            const schools = await SchoolRepository.findAll();
            return ResponseUtil.success(res, 200, 'Schools retrieved successfully', schools);
        } catch (error) {
            console.error('Get all schools error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve schools', error);
        }
    },

    getSchoolById: async (req, res) => {
        try {
            const school = await SchoolRepository.findById(req.params.id);

            if (!school) {
                return ResponseUtil.notFound(res, 'School not found');
            }
            
            return ResponseUtil.success(res, 200, 'School retrieved successfully', school);
        } catch (error) {
            console.error('Get school by id error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve school', error);
        }
    },

    updateSchool: async (req, res) => {
        try {
            const updated = await SchoolRepository.update(req.params.id, req.body);
            
            if (!updated) {
                return ResponseUtil.notFound(res, 'School not found');
            }
            
            return ResponseUtil.success(res, 200, 'School updated successfully', updated);
        } catch (error) {
            console.error('Update school error:', error);
            return ResponseUtil.serverError(res, 'Failed to update school', error);
        }
    },

    deleteSchool: async (req, res) => {
        try {
            const deleted = await SchoolRepository.delete(req.params.id);
            
            if (!deleted) {
                return ResponseUtil.notFound(res, 'School not found');
            }
            
            return ResponseUtil.success(res, 200, 'School deleted successfully');
        } catch (error) {
            console.error('Delete school error:', error);
            return ResponseUtil.serverError(res, 'Failed to delete school', error);
        }
    },

    getSchoolsByCity: async (req, res) => {
        try {
            const { city } = req.params;
            const schools = await SchoolRepository.findByCity(city);
            
            return ResponseUtil.success(res, 200, `Schools in ${city} retrieved successfully`, schools);
        } catch (error) {
            console.error('Get schools by city error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve schools by city', error);
        }
    },

    getSchoolsByDistrict: async (req, res) => {
        try {
            const { district } = req.params;
            const schools = await SchoolRepository.findByDistrict(district);
            
            return ResponseUtil.success(res, 200, `Schools in ${district} district retrieved successfully`, schools);
        } catch (error) {
            console.error('Get schools by district error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve schools by district', error);
        }
    }
};