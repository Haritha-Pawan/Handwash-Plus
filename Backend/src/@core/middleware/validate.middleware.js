
export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,  
            stripUnknown: true,  
            convert: true     
        });

        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                const key = detail.path[0];
                errors[key] = detail.message;
            });

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        req[property] = value;
        next();
    };
};