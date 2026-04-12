import Joi from 'joi';


export const validateIndicatorQuery = (data) => {
  const schema = Joi.object({
    indicatorCode: Joi.string()
      .required()
      .pattern(/^[A-Z0-9.]+$/)
      .length(14)
      .messages({
        'string.pattern.base': 'Indicator code must be in valid World Bank format (e.g., SH.STA.BASS.ZS)',
        'string.length': 'Indicator code must be exactly 14 characters (e.g., SH.STA.BASS.ZS)'
      }),
    country: Joi.string()
      .required()
      .length(3)
      .uppercase()
      .messages({
        'string.length': 'Country code must be 3 characters (ISO 3166-1 alpha-3)'
      }),
    dateRange: Joi.string()
      .pattern(/^\d{4}:\d{4}$/)
      .messages({
        'string.pattern.base': 'Date range must be in format YYYY:YYYY (e.g., 2010:2026)'
      })
  });

  return schema.validate(data, { abortEarly: true });
};


export const validateCountryCode = (data) => {
  const schema = Joi.object({
    countryCode: Joi.string()
      .required()
      .length(3)
      .uppercase()
      .messages({
        'string.length': 'Country code must be 3 characters (ISO 3166-1 alpha-3)'
      })
  });

  return schema.validate(data, { abortEarly: true });
};


export const validateBatchIndicators = (data) => {
  const schema = Joi.object({
    countryCode: Joi.string()
      .required()
      .length(3)
      .uppercase(),
    indicators: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[A-Z0-9.]+$/)
          .length(14)
      )
      .optional()
      .messages({
        'array.base': 'Indicators must be an array'
      }),
    dateRange: Joi.string()
      .pattern(/^\d{4}:\d{4}$/)
      .optional()
  });

  return schema.validate(data, { abortEarly: true });
};

export default {
  validateIndicatorQuery,
  validateCountryCode,
  validateBatchIndicators
};
