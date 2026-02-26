/**
 * Standard API Response Utility
 * Provides consistent response formatting across the application
 */

class ResponseUtil {
    /**
     * Success Response
     * @param {Object} res - Express response object
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Success message
     * @param {*} data - Response data
     * @param {Object} meta - Additional metadata (pagination, etc.)
     */
    static success(res, statusCode = 200, message = 'Success', data = null, meta = null) {
        const response = {
            success: true,
            message,
            timestamp: new Date().toISOString(),
            ...(data && { data })
        };

        // Add metadata if provided (pagination, etc.)
        if (meta) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Error Response
     * @param {Object} res - Express response object
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {*} errors - Detailed error information
     * @param {string} stack - Error stack trace (development only)
     */
    static error(res, statusCode = 500, message = 'Internal Server Error', errors = null, stack = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        // Add detailed errors if provided
        if (errors) {
            response.errors = errors;
        }

        // Add stack trace in development environment
        if (process.env.NODE_ENV === 'development' && stack) {
            response.stack = stack;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Created Response (201)
     * @param {Object} res - Express response object
     * @param {string} message - Success message
     * @param {*} data - Created resource data
     */
    static created(res, message = 'Resource created successfully', data = null) {
        return this.success(res, 201, message, data);
    }

    /**
     * No Content Response (204)
     * @param {Object} res - Express response object
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Bad Request Response (400)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {*} errors - Validation errors
     */
    static badRequest(res, message = 'Bad Request', errors = null) {
        return this.error(res, 400, message, errors);
    }

    /**
     * Unauthorized Response (401)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, 401, message);
    }

    /**
     * Forbidden Response (403)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     */
    static forbidden(res, message = 'Access forbidden') {
        return this.error(res, 403, message);
    }

    /**
     * Not Found Response (404)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, 404, message);
    }

    /**
     * Conflict Response (409)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {*} errors - Conflict details
     */
    static conflict(res, message = 'Resource conflict', errors = null) {
        return this.error(res, 409, message, errors);
    }

    /**
     * Validation Error Response (422)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {*} errors - Validation errors
     */
    static validationError(res, message = 'Validation failed', errors = null) {
        return this.error(res, 422, message, errors);
    }

    /**
     * Too Many Requests Response (429)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {number} retryAfter - Retry after seconds
     */
    static tooManyRequests(res, message = 'Too many requests', retryAfter = 60) {
        res.set('Retry-After', retryAfter);
        return this.error(res, 429, message);
    }

    /**
     * Server Error Response (500)
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    static serverError(res, message = 'Internal server error', error = null) {
        return this.error(
            res, 
            500, 
            message, 
            error?.message || null, 
            error?.stack || null
        );
    }

    /**
     * Paginated Response
     * @param {Object} res - Express response object
     * @param {string} message - Success message
     * @param {Array} data - Paginated data
     * @param {Object} pagination - Pagination metadata
     */
    static paginated(res, message = 'Success', data = [], pagination = {}) {
        return this.success(res, 200, message, data, { pagination });
    }

    /**
     * File Response
     * @param {Object} res - Express response object
     * @param {Buffer|Stream} file - File data
     * @param {string} filename - File name
     * @param {string} contentType - MIME type
     */
    static file(res, file, filename, contentType) {
        res.set('Content-Type', contentType);
        res.set('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(file);
    }

    /**
     * Stream Response
     * @param {Object} res - Express response object
     * @param {Stream} stream - Data stream
     * @param {string} contentType - MIME type
     */
    static stream(res, stream, contentType = 'application/json') {
        res.set('Content-Type', contentType);
        return stream.pipe(res);
    }

    /**
     * Build Pagination Metadata
     * @param {number} page - Current page
     * @param {number} limit - Items per page
     * @param {number} total - Total items
     * @returns {Object} Pagination metadata
     */
    static buildPagination(page = 1, limit = 10, total = 0) {
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNext,
            hasPrev,
            nextPage: hasNext ? page + 1 : null,
            prevPage: hasPrev ? page - 1 : null
        };
    }

    /**
     * Format validation errors from Joi
     * @param {Object} validationError - Joi validation error
     * @returns {Array} Formatted validation errors
     */
    static formatValidationErrors(validationError) {
        if (!validationError || !validationError.details) {
            return null;
        }

        return validationError.details.map(error => ({
            field: error.path.join('.'),
            message: error.message,
            type: error.type
        }));
    }

    /**
     * Handle MongoDB duplicate key error
     * @param {Error} error - MongoDB error
     * @returns {Object} Formatted error response
     */
    static handleDuplicateKeyError(error) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];
        
        return {
            field,
            message: `${field} with value '${value}' already exists`,
            code: 'DUPLICATE_KEY'
        };
    }

    /**
     * Handle MongoDB validation error
     * @param {Error} error - MongoDB validation error
     * @returns {Array} Formatted validation errors
     */
    static handleMongoValidationError(error) {
        if (!error.errors) {
            return null;
        }

        return Object.keys(error.errors).map(field => ({
            field,
            message: error.errors[field].message,
            type: error.errors[field].kind
        }));
    }
}

// Export individual functions for backward compatibility
export const successResponse = ResponseUtil.success;
export const errorResponse = ResponseUtil.error;
export const createdResponse = ResponseUtil.created;
export const noContentResponse = ResponseUtil.noContent;
export const badRequestResponse = ResponseUtil.badRequest;
export const unauthorizedResponse = ResponseUtil.unauthorized;
export const forbiddenResponse = ResponseUtil.forbidden;
export const notFoundResponse = ResponseUtil.notFound;
export const conflictResponse = ResponseUtil.conflict;
export const validationErrorResponse = ResponseUtil.validationError;
export const tooManyRequestsResponse = ResponseUtil.tooManyRequests;
export const serverErrorResponse = ResponseUtil.serverError;
export const paginatedResponse = ResponseUtil.paginated;
export const fileResponse = ResponseUtil.file;
export const streamResponse = ResponseUtil.stream;

// Export the class as default
export default ResponseUtil;