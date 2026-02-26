
import Joi from 'joi';


export const createSchoolSchema = Joi.object({
	name: Joi.string().min(2).max(100).required(),
	address: Joi.string().min(5).max(255).required(),
	city: Joi.string().min(2).max(100).required(),
	district: Joi.string().min(2).max(100).required(),
	state: Joi.string().min(2).max(100).required(),
	pincode: Joi.string().min(4).max(10).required(),
	contactNumber: Joi.string().min(7).max(15).optional(),
	email: Joi.string().email().optional(),
	
});


export const updateSchoolSchema = Joi.object({
	name: Joi.string().min(2).max(100),
	address: Joi.string().min(5).max(255),
	city: Joi.string().min(2).max(100),
	district: Joi.string().min(2).max(100),
	state: Joi.string().min(2).max(100),
	pincode: Joi.string().min(4).max(10),
	contactNumber: Joi.string().min(7).max(15),
	email: Joi.string().email(),

}).min(1);
