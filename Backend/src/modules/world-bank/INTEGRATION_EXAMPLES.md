<!-- API Integration Example -->
# World Bank WASH Data API Integration Example

This document shows practical examples of using the World Bank integration in your Handwash+ application.

## Quick Start

### 1. Direct Service Usage

```javascript
import WorldBankService from './modules/world-bank/world-bank.service.js';

// Example 1: Get basic sanitation data for Sri Lanka
async function getSanitationData() {
  try {
    const result = await WorldBankService.getIndicatorData(
      'LKA',                    // Country code
      'SH.STA.BASS.ZS',        // Basic Sanitation indicator
      '2010:2026'              // Date range
    );
    
    console.log('Latest year data:', result.data[0]);
    console.log('Metadata:', result.metadata);
    
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

### 2. HTTP Request

```bash
# Get all available indicators
curl -X GET \
  http://localhost:5000/api/world-bank/indicators/available \
  -H 'Content-Type: application/json'

# Get specific indicator (Basic Sanitation for Sri Lanka)
curl -X GET \
  'http://localhost:5000/api/world-bank/indicators/SH.STA.BASS.ZS?country=LKA&dateRange=2010:2026' \
  -H 'Content-Type: application/json'

# Get all WASH indicators for a country
curl -X GET \
  'http://localhost:5000/api/world-bank/country/LKA?dateRange=2010:2026' \
  -H 'Content-Type: application/json'

# Get sanitation data
curl -X GET \
  http://localhost:5000/api/world-bank/sanitation/LKA \
  -H 'Content-Type: application/json'

# Get water access data
curl -X GET \
  http://localhost:5000/api/world-bank/water/LKA \
  -H 'Content-Type: application/json'
```

## Real-World Scenarios

### Scenario 1: Display WASH Indicators Dashboard

```javascript
import WorldBankService from './modules/world-bank/world-bank.service.js';

export const dashboardController = {
  getWASHDashboard: async (req, res) => {
    try {
      // Fetch all WASH indicators for Sri Lanka
      const washData = await WorldBankService.getMultipleIndicators('LKA');
      
      // Format for dashboard display
      const dashboardData = {
        country: 'Sri Lanka',
        lastUpdated: new Date().toISOString(),
        indicators: {}
      };
      
      // Extract latest values
      for (const [indicator, dataPoints] of Object.entries(washData.indicators)) {
        if (dataPoints && dataPoints.length > 0) {
          const latest = dataPoints[0]; // Latest year (sorted descending)
          dashboardData.indicators[indicator] = {
            name: latest.indicatorName,
            latestValue: latest.value,
            latestYear: latest.year,
            unit: latest.unit
          };
        }
      }
      
      return ResponseUtil.success(res, 'Dashboard data retrieved', dashboardData);
    } catch (error) {
      return ResponseUtil.serverError(res, 'Failed to fetch dashboard data', error);
    }
  }
};
```

### Scenario 2: Compare WASH Indicators Over Time

```javascript
export const analyticsController = {
  getIndicatorTrend: async (req, res) => {
    try {
      const { countryCode = 'LKA', indicator = 'SH.STA.BASS.ZS' } = req.query;
      
      const result = await WorldBankService.getIndicatorData(
        countryCode,
        indicator,
        '2010:2026'
      );
      
      // Format for trend analysis
      const trendData = {
        indicator: result.indicator,
        country: result.country,
        trend: result.data.map(d => ({
          year: d.year,
          value: d.value,
          change: null // Will be calculated below
        })).reverse() // Sort ascending by year
      };
      
      // Calculate year-over-year changes
      for (let i = 1; i < trendData.trend.length; i++) {
        const current = trendData.trend[i].value;
        const previous = trendData.trend[i - 1].value;
        trendData.trend[i].change = ((current - previous) / previous * 100).toFixed(2);
      }
      
      return ResponseUtil.success(res, 'Trend data retrieved', trendData);
    } catch (error) {
      return ResponseUtil.serverError(res, 'Failed to fetch trend data', error);
    }
  }
};
```

### Scenario 3: Multi-Country Comparison

```javascript
export const comparisonController = {
  compareCountries: async (req, res) => {
    try {
      const { countries = ['LKA', 'IND', 'BGD'], indicator = 'SH.STA.BASS.ZS' } = req.query;
      
      // Fetch data for multiple countries
      const countryDataPromises = countries.map(code =>
        WorldBankService.getIndicatorData(code, indicator, '2010:2026')
          .then(result => ({
            country: result.country,
            data: result.data[0] // Get latest year
          }))
          .catch(error => ({
            country: code,
            error: 'Failed to fetch data'
          }))
      );
      
      const comparison = await Promise.all(countryDataPromises);
      
      return ResponseUtil.success(res, 'Country comparison retrieved', {
        indicator,
        countries: comparison,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return ResponseUtil.serverError(res, 'Failed to fetch country comparison', error);
    }
  }
};
```

### Scenario 4: Generate Report with WASH Data

```javascript
import PDFGenerator from '../../reports/generators/pdf-generator.js';

export const reportController = {
  generateWASHReport: async (req, res) => {
    try {
      const { countryCode = 'LKA', format = 'pdf' } = req.query;
      
      // Fetch comprehensive WASH data
      const washData = await WorldBankService.getMultipleIndicators(countryCode);
      
      const reportContent = {
        title: `WASH Status Report - ${washData.country}`,
        generatedAt: new Date().toISOString(),
        sections: []
      };
      
      // Create sections for each indicator
      for (const [code, dataPoints] of Object.entries(washData.indicators)) {
        if (dataPoints && dataPoints.length > 0) {
          reportContent.sections.push({
            title: dataPoints[0].indicatorName,
            code,
            latestValue: dataPoints[0].value,
            latestYear: dataPoints[0].year,
            historical: dataPoints.slice(0, 5) // Last 5 years
          });
        }
      }
      
      if (format === 'pdf') {
        const pdfBuffer = await PDFGenerator.generate(reportContent);
        res.contentType('application/pdf');
        res.send(pdfBuffer);
      } else {
        return ResponseUtil.success(res, 'Report data generated', reportContent);
      }
    } catch (error) {
      return ResponseUtil.serverError(res, 'Failed to generate report', error);
    }
  }
};
```

### Scenario 5: Alert on WASH Metric Changes

```javascript
export const monitoringService = {
  checkWASHMetrics: async (schoolId) => {
    try {
      // Get current metrics
      const currentMetrics = await WorldBankService.getIndicatorData(
        'LKA',
        'SH.STA.BASS.ZS',
        '2026:2026' // Current year only
      );
      
      // Compare with last known values from database
      const school = await School.findById(schoolId);
      const previousValue = school.lastWASHMetric;
      const currentValue = currentMetrics.data[0].value;
      
      if (previousValue && currentValue < previousValue - 5) {
        // Alert if decreased by more than 5%
        await notificationService.send({
          type: 'WASH_METRIC_ALERT',
          message: `WASH metric decreased from ${previousValue}% to ${currentValue}%`,
          schoolId,
          data: currentMetrics
        });
      }
      
      // Update school record
      school.lastWASHMetric = currentValue;
      school.lastWASHUpdate = new Date();
      await school.save();
    } catch (error) {
      console.error('Error monitoring WASH metrics:', error);
    }
  }
};
```

## Integration with Existing Modules

### With Reporting Module

```javascript
// in reports/report.service.js
import WorldBankService from '../world-bank/world-bank.service.js';

export const ReportService = {
  generateWASHAnalysisReport: async (schoolId, dateRange) => {
    try {
      // Get school information
      const school = await School.findById(schoolId).lean();
      
      // Get WASH data for country
      const washData = await WorldBankService.getIndicatorData(
        'LKA',
        'SH.STA.BASS.ZS',
        dateRange
      );
      
      // Combine with school inventory data
      const report = {
        school: school.name,
        location: school.district,
        nationalMetrics: washData.data,
        schoolInventory: await getSchoolInventory(schoolId),
        comparison: calculateComparison(washData, school),
        recommendations: generateRecommendations(washData, school)
      };
      
      return report;
    } catch (error) {
      throw error;
    }
  }
};
```

### With Notifications Module

```javascript
// in notifications/notification.service.js
import WorldBankService from '../world-bank/world-bank.service.js';

export const NotificationService = {
  sendWASHUpdate: async (schoolIds) => {
    try {
      const washData = await WorldBankService.getIndicatorData(
        'LKA',
        'SH.STA.BASS.ZS'
      );
      
      const notifications = schoolIds.map(schoolId => ({
        type: 'WASH_DATA_UPDATE',
        recipient: schoolId,
        title: 'New WASH Data Available',
        message: `New sanitation data available: ${washData.data[0].value}%`,
        data: washData,
        priority: 'medium'
      }));
      
      return await Notification.insertMany(notifications);
    } catch (error) {
      throw error;
    }
  }
};
```

## Response Examples

### Success Response Example

```json
{
  "success": true,
  "country": "LKA",
  "indicator": "SH.STA.BASS.ZS",
  "data": [
    {
      "year": 2026,
      "value": 95.5,
      "countryCode": "LKA",
      "countryName": "Sri Lanka",
      "indicatorName": "Population using at least basic sanitation services (% of population)",
      "unit": "Percentage (%)",
      "source": "World Bank"
    },
    {
      "year": 2025,
      "value": 94.8,
      "countryCode": "LKA",
      "countryName": "Sri Lanka",
      "indicatorName": "Population using at least basic sanitation services (% of population)",
      "unit": "Percentage (%)",
      "source": "World Bank"
    }
  ],
  "metadata": {
    "total": 17,
    "filtered": 17,
    "yearRange": {
      "from": 2010,
      "to": 2026
    },
    "lastUpdated": "2026-02-27T10:30:45.123Z",
    "source": "World Bank Open Data"
  },
  "timestamp": "2026-02-27T10:30:45.123Z"
}
```

### Error Response Example

```json
{
  "success": false,
  "country": "INVALID",
  "indicator": "SH.STA.BASS.ZS",
  "error": "Country or indicator not found",
  "statusCode": 404,
  "timestamp": "2026-02-27T10:30:45.123Z"
}
```

## Best Practices

1. **Always handle errors gracefully**
2. **Cache frequently accessed data** (implement Redis layer)
3. **Implement request timeouts** (already configured at 10s)
4. **Validate all input parameters** (Joi validation in place)
5. **Log API calls** for monitoring and debugging
6. **Use the service layer** instead of making direct API calls
7. **Format responses consistently** using DTOs
8. **Include metadata** in responses for context

## Troubleshooting

### Common Issues

**Q: Getting 404 error?**
A: Verify the indicator code format (e.g., SH.STA.BASS.ZS) and country code (3 letters, uppercase)

**Q: Request timeout?**
A: The API timeout is 10 seconds. If World Bank API is slow, consider implementing a cache

**Q: No data returned?**
A: Some indicators might not have data for certain countries or years. Check the API documentation.

**Q: Rate limited?**
A: Implement request batching and caching to reduce API calls

---

**Handwash+ Integration Guide**
Version 1.0.0
Last Updated: February 27, 2026
