import WorldBankService from './world-bank.service.js';
import ResponseUtil from '../../@core/utils/response.util.js';
import { validateIndicatorQuery } from './world-bank.validation.js';
import { washConfig } from '../../config/environment.config.js';

export const WorldBankController = {
 
  getIndicator: async (req, res) => {
    try {
      const { indicatorCode } = req.params;
      const { dateRange = '2010:2026', country = 'LKA' } = req.query;

   
      const { error, value } = validateIndicatorQuery({
        indicatorCode,
        dateRange,
        country
      });

      if (error) {
        return ResponseUtil.badRequest(res, error.details[0].message);
      }

      const result = await WorldBankService.getIndicatorData(
        value.country,
        value.indicatorCode,
        value.dateRange
      );

      if (!result.success) {
        return ResponseUtil.notFound(res, result.error);
      }

      return ResponseUtil.success(
        res,
        200,
        'Indicator data retrieved successfully',
        result
      );
    } catch (error) {
      console.error('Get indicator error:', error);
      try {
        const errorData = JSON.parse(error.message);
        return ResponseUtil.serverError(res, errorData.error, errorData);
      } catch {
        return ResponseUtil.serverError(res, 'Failed to fetch indicator data', error);
      }
    }
  },

 
  getCountryWASHData: async (req, res) => {
    try {
      const { countryCode = 'LKA' } = req.params;
      const { dateRange = '2010:2026', indicators } = req.query;

      // Validate country code
      if (!countryCode || countryCode.length !== 3) {
        return ResponseUtil.badRequest(res, 'Invalid country code format (must be 3 characters)');
      }

      // Parse indicators if provided as comma-separated string
      const indicatorList = indicators
        ? indicators.split(',').map(i => i.trim())
        : undefined;

      const result = await WorldBankService.getMultipleIndicators(
        countryCode.toUpperCase(),
        indicatorList,
        dateRange
      );

      if (!result.success || Object.keys(result.indicators).length === 0) {
        return ResponseUtil.notFound(
          res,
          'No data available for the requested country'
        );
      }

      return ResponseUtil.success(
        res,
        200,
        'Country WASH data retrieved successfully',
        result
      );
    } catch (error) {
      console.error('Get country WASH data error:', error);
      try {
        const errorData = JSON.parse(error.message);
        return ResponseUtil.serverError(res, errorData.error, errorData);
      } catch {
        return ResponseUtil.serverError(res, 'Failed to fetch country WASH data', error);
      }
    }
  },

 
  getBasicSanitationData: async (req, res) => {
    try {
      const { countryCode = 'LKA' } = req.params;
      const { dateRange = '2010:2026' } = req.query;

      const result = await WorldBankService.getIndicatorData(
        countryCode.toUpperCase(),
        washConfig.indicators.basicSanitation,
        dateRange
      );

      if (!result.success) {
        return ResponseUtil.notFound(res, result.error);
      }

      return ResponseUtil.success(
        res,
        200,
        'Sanitation data retrieved successfully',
        result
      );
    } catch (error) {
      console.error('Get sanitation data error:', error);
      try {
        const errorData = JSON.parse(error.message);
        return ResponseUtil.serverError(res, errorData.error, errorData);
      } catch {
        return ResponseUtil.serverError(res, 'Failed to fetch sanitation data', error);
      }
    }
  },

  
  getSafeWaterData: async (req, res) => {
    try {
      const { countryCode = 'LKA' } = req.params;
      const { dateRange = '2010:2026' } = req.query;

      const result = await WorldBankService.getIndicatorData(
        countryCode.toUpperCase(),
        washConfig.indicators.safelyManagedWater,
        dateRange
      );

      if (!result.success) {
        return ResponseUtil.notFound(res, result.error);
      }

      return ResponseUtil.success(
        res,
        200,
        'Water data retrieved successfully',
        result
      );
    } catch (error) {
      console.error('Get water data error:', error);
      try {
        const errorData = JSON.parse(error.message);
        return ResponseUtil.serverError(res, errorData.error, errorData);
      } catch {
        return ResponseUtil.serverError(res, 'Failed to fetch water data', error);
      }
    }
  },

  
  getAvailableIndicators: async (req, res) => {
    try {
      const indicators = await WorldBankService.getAvailableIndicators();

      return ResponseUtil.success(
        res,
        200,
        'Available indicators retrieved successfully',
        {
          success: true,
          indicators,
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Get available indicators error:', error);
      return ResponseUtil.serverError(
        res,
        'Failed to fetch available indicators',
        error
      );
    }
  }
};

export default WorldBankController;
