import Joi from 'joi';

export const createSchoolSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(5).max(255).required(),
    district: Joi.string().min(2).max(100).required(),
    city: Joi.string().min(2).max(100).required(),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    createdBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional() 
});

export const updateSchoolSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    address: Joi.string().min(5).max(255),
    district: Joi.string().min(2).max(100),
    city: Joi.string().min(2).max(100),
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
    createdBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
}).min(1);