
import { SchoolRepository } from "./school.repository.js";
import ResponseUtil from "../../@core/utils/response.util.js";
import CreateSchoolDTO from "./dto/create-school.dto.js";
import UpdateSchoolDTO from "./dto/update-school.dto.js";
import SchoolResponseDTO from "./dto/school-response.dto.js";

export const SchoolController = {

    createSchool: async (req, res) => {
        try {
            console.log(' Creating school with data:', req.body);
            
            
            const createDTO = new CreateSchoolDTO({
                ...req.body,
                createdBy: req.user?._id || req.user?.id
            });
            
        
            if (createDTO.validate && !createDTO.validate()) {
                return ResponseUtil.badRequest(res, 'Invalid school data');
            }

        
            const school = await SchoolRepository.create(createDTO);
            
            const responseDTO = new SchoolResponseDTO(school);
            
            return ResponseUtil.created(res, 'School created successfully', responseDTO);
        } catch (error) {
            console.error(' Create school error:', error);
            
            if (error.code === 11000) {
                return ResponseUtil.conflict(res, 'School with this name already exists');
            }
            
            return ResponseUtil.serverError(res, 'Failed to create school', error);
        }
    },

    getAllSchools: async (req, res) => {
        try {
            const schools = await SchoolRepository.findAll();
            
            const responseDTOs = SchoolResponseDTO.fromArray(schools);
            
            return ResponseUtil.success(res, 200, 'Schools retrieved successfully', responseDTOs);
        } catch (error) {
            console.error(' Get all schools error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve schools', error);
        }
    },

    getSchoolById: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return ResponseUtil.badRequest(res, 'School ID is required');
            }

            const school = await SchoolRepository.findById(id);

            if (!school) {
                return ResponseUtil.notFound(res, 'School not found');
            }
            
            const responseDTO = new SchoolResponseDTO(school);
            
            return ResponseUtil.success(res, 200, 'School retrieved successfully', responseDTO);
        } catch (error) {
            console.error(' Get school by id error:', error);
            
            if (error.name === 'CastError') {
                return ResponseUtil.badRequest(res, 'Invalid school ID format');
            }
            
            return ResponseUtil.serverError(res, 'Failed to retrieve school', error);
        }
    },

    updateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return ResponseUtil.badRequest(res, 'School ID is required');
            }

            const updateDTO = new UpdateSchoolDTO(req.body);
            
            if (!updateDTO.hasUpdates || !updateDTO.hasUpdates()) {
                return ResponseUtil.badRequest(res, 'No valid fields to update');
            }

            const updateData = updateDTO.getUpdateData 
                ? updateDTO.getUpdateData() 
                : updateDTO;

            const updated = await SchoolRepository.update(id, updateData);
            
            if (!updated) {
                return ResponseUtil.notFound(res, 'School not found');
            }
            
            const responseDTO = new SchoolResponseDTO(updated);
            
            return ResponseUtil.success(res, 200, 'School updated successfully', responseDTO);
        } catch (error) {
            console.error(' Update school error:', error);
            
            if (error.code === 11000) {
                return ResponseUtil.conflict(res, 'School with this name already exists');
            }
            
            if (error.name === 'CastError') {
                return ResponseUtil.badRequest(res, 'Invalid school ID format');
            }
            
            return ResponseUtil.serverError(res, 'Failed to update school', error);
        }
    },

    deleteSchool: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return ResponseUtil.badRequest(res, 'School ID is required');
            }

            const deleted = await SchoolRepository.delete(id);
            
            if (!deleted) {
                return ResponseUtil.notFound(res, 'School not found');
            }
            
            return ResponseUtil.success(res, 200, 'School deleted successfully');
        } catch (error) {
            console.error(' Delete school error:', error);
            
            if (error.name === 'CastError') {
                return ResponseUtil.badRequest(res, 'Invalid school ID format');
            }
            
            return ResponseUtil.serverError(res, 'Failed to delete school', error);
        }
    },

    getSchoolsByCity: async (req, res) => {
        try {
            const { city } = req.params;
            
            if (!city) {
                return ResponseUtil.badRequest(res, 'City name is required');
            }

            const schools = await SchoolRepository.findByCity(city);
            
            const responseDTOs = SchoolResponseDTO.fromArray(schools);
            
            return ResponseUtil.success(res, 200, `Schools in ${city} retrieved successfully`, responseDTOs);
        } catch (error) {
            console.error('❌ Get schools by city error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve schools by city', error);
        }
    },

    getSchoolsByDistrict: async (req, res) => {
        try {
            const { district } = req.params;
            
            if (!district) {
                return ResponseUtil.badRequest(res, 'District name is required');
            }

            const schools = await SchoolRepository.findByDistrict(district);
            
            const responseDTOs = SchoolResponseDTO.fromArray(schools);
            
            return ResponseUtil.success(res, 200, `Schools in ${district} district retrieved successfully`, responseDTOs);
        } catch (error) {
            console.error(' Get schools by district error:', error);
            return ResponseUtil.serverError(res, 'Failed to retrieve schools by district', error);
        }
    }
};

export const {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
    getSchoolsByCity,
    getSchoolsByDistrict
} = SchoolController;

export default SchoolController;
