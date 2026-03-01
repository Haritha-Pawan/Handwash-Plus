import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
    }),

  content: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.empty": "Content is required",
    }),
});