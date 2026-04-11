import Joi from "joi";

export const createGradesSchema = Joi.object({
  count: Joi.number()
    .integer()
    .min(1)
    .max(13)
    .required()
    .messages({
      "number.base": "Count must be a number",
      "number.integer": "Count must be a whole number",
      "number.min": "Count must be at least 1",
      "number.max": "Count cannot exceed 13",
      "any.required": "Count is required",
    }),
});

export const createIndividualGradeSchema = Joi.object({
  gradeNumber: Joi.number()
    .integer()
    .min(1)
    .max(13)
    .required()
    .messages({
      "number.base": "Grade number must be a number",
      "number.integer": "Grade number must be a whole number",
      "number.min": "Grade number must be at least 1",
      "number.max": "Grade number cannot exceed 13",
      "any.required": "Grade number is required",
    }),
  studentCount: Joi.number().integer().min(0).optional(),
  lowThreshold: Joi.number().min(1).optional(),
});

export const updateGradeSchema = Joi.object({
  studentCount: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Student count must be a number",
      "number.integer": "Student count must be a whole number",
      "number.min": "Student count cannot be negative",
    }),

  lowThreshold: Joi.number()
    .min(1)
    .messages({
      "number.base": "Low threshold must be a number",
      "number.min": "Low threshold must be at least 1",
    }),

  currentQuantity: Joi.number()
    .min(0)
    .messages({
      "number.base": "Current quantity must be a number",
      "number.min": "Current quantity cannot be negative",
    }),
})
  .min(1)
  .messages({
    "object.min": "Please provide at least one field to update: studentCount, lowThreshold, or currentQuantity",
  });

export const distributeBottlesSchema = Joi.object({
  bottlesPerClassroom: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Bottles per classroom must be a number",
      "number.integer": "Bottles per classroom must be a whole number",
      "number.min": "Bottles per classroom must be at least 1",
      "any.required": "Bottles per classroom is required",
    }),

  month: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({
      "string.base": "Month must be a string",
      "string.pattern.base": "Month must be in YYYY-MM format",
      "any.required": "Month is required",
    }),
});