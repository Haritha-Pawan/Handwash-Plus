import axios from 'axios';
import { washConfig } from '../../config/environment.config.js';

const axiosInstance = axios.create({
  baseURL: washConfig.worldBank.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Handwash-Plus/1.0'
  }
});

export const WorldBankService = {
 
  getIndicatorData: async (countryCode, indicatorCode, dateRange = '2010:2026', options = {}) => {
    try {
      const params = {
        format: washConfig.worldBank.format || 'json',
        per_page: washConfig.worldBank.perPage || 100,
        date: dateRange,
        ...options
      };

      const response = await axiosInstance.get(
        `/country/${countryCode}/indicator/${indicatorCode}`,
        { params }
      );

      return WorldBankService.formatResponse(response.data, countryCode, indicatorCode);
    } catch (error) {
      throw WorldBankService.handleError(error, countryCode, indicatorCode);
    }
  },

 
  getMultipleIndicators: async (countryCode, indicatorCodes = [], dateRange = '2010:2026') => {
    try {
      if (!indicatorCodes || indicatorCodes.length === 0) {
        indicatorCodes = Object.values(washConfig.indicators);
      }

      const requests = indicatorCodes.map(code =>
        WorldBankService.getIndicatorData(countryCode, code, dateRange)
      );

      const results = await Promise.all(requests);

      return {
        success: true,
        country: countryCode,
        dateRange,
        timestamp: new Date().toISOString(),
        indicators: results.reduce((acc, result) => {
          if (result.success && result.data.length > 0) {
            acc[result.indicator] = result.data;
          }
          return acc;
        }, {})
      };
    } catch (error) {
      throw WorldBankService.handleError(error);
    }
  },

  
  getAvailableIndicators: async () => {
    return Object.entries(washConfig.indicators).map(([key, value]) => ({
      name: key,
      code: value,
      description: WorldBankService.getIndicatorDescription(value)
    }));
  },

 
  formatResponse: (apiData, countryCode, indicatorCode) => {
    try {
     
      const [metadata, records] = apiData || [null, []];

      if (!records || records.length === 0) {
        return {
          success: true,
          country: countryCode,
          indicator: indicatorCode,
          data: [],
          metadata: {
            total: 0,
            filtered: 0,
            message: 'No data available for the requested indicator'
          },
          timestamp: new Date().toISOString()
        };
      }

      // Clean and format the data
      const formattedData = records
        .filter(record => record.value !== null && record.value !== undefined)
        .map(record => ({
          year: parseInt(record.date),
          value: parseFloat(record.value),
          countryCode: record.countryiso3code,
          countryName: record.country?.value || '',
          indicatorName: record.indicator?.value || indicatorCode,
          unit: 'Percentage (%)',
          source: 'World Bank'
        }))
        .sort((a, b) => b.year - a.year); // Sort by year descending

      return {
        success: true,
        country: countryCode,
        indicator: indicatorCode,
        data: formattedData,
        metadata: {
          total: formattedData.length,
          filtered: formattedData.length,
          yearRange: {
            from: Math.min(...formattedData.map(d => d.year)),
            to: Math.max(...formattedData.map(d => d.year))
          },
          lastUpdated: new Date().toISOString(),
          source: 'World Bank Open Data'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        country: countryCode,
        indicator: indicatorCode,
        data: [],
        error: 'Error formatting response',
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Handle errors from API calls
   * @param {Error} error - Error object
   * @param {string} countryCode - Country code
   * @param {string} indicatorCode - Indicator code
   * @throws {Error} Formatted error
   */
  handleError: (error, countryCode = '', indicatorCode = '') => {
    let errorResponse = {
      success: false,
      country: countryCode,
      indicator: indicatorCode,
      error: 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };

    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;

      errorResponse.error = message || `API Error: ${status}`;
      errorResponse.statusCode = status;

      switch (status) {
        case 404:
          errorResponse.error = 'Country or indicator not found';
          break;
        case 400:
          errorResponse.error = 'Invalid request parameters';
          break;
        case 429:
          errorResponse.error = 'Rate limited. Please try again later';
          break;
        case 503:
          errorResponse.error = 'World Bank API is temporarily unavailable';
          break;
        default:
          errorResponse.error = `API Error: ${message || status}`;
      }
    } else if (error.request) {
      // Request made but no response
      errorResponse.error = 'No response from World Bank API';
      errorResponse.statusCode = 503;
    } else if (error.code === 'ECONNABORTED') {
      errorResponse.error = 'Request timeout - API took too long to respond';
      errorResponse.statusCode = 504;
    }

    return new Error(JSON.stringify(errorResponse));
  },

  /**
   * Get human-readable description for indicator
   * @param {string} code - Indicator code
   * @returns {string} Description
   */
  getIndicatorDescription: (code) => {
    const descriptions = {
      'SH.STA.BASS.ZS': 'Population using at least basic sanitation services (% of population)',
      'SH.STA.SMSS.ZS': 'Population using safely managed sanitation services (% of population)',
      'SH.H2O.SMDW.ZS': 'Population using safely managed drinking-water services (% of population)',
      'SH.H2O.BASW.ZS': 'Population using at least basic drinking-water services (% of population)'
    };

    return descriptions[code] || 'WASH Indicator';
  }
};

export default WorldBankService;
