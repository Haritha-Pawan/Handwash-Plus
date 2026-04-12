import WorldBankService from './world-bank.service.js';
import ResponseUtil from '../../@core/utils/response.util.js';
import { validateIndicatorQuery } from './world-bank.validation.js';

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
  }
};

export default WorldBankController;
