# World Bank WASH Data Integration

## Overview

This module integrates the World Bank Open Data API to fetch Water, Sanitation, and Hygiene (WASH) indicators data. It provides endpoints to retrieve and format indicator data for countries globally, with a focus on Sri Lanka (LKA).

## Features

- ✅ Fetch indicator data from World Bank API
- ✅ Support for multiple WASH indicators
- ✅ Batch requests for multiple indicators
- ✅ Comprehensive error handling
- ✅ Structured JSON response format
- ✅ Input validation using Joi
- ✅ Type-safe DTOs
- ✅ ISO 3166-1 alpha-3 country code support

## API Endpoint

**Base URL:** `https://api.worldbank.org/v2`

**Example Endpoint:**
```
https://api.worldbank.org/v2/country/LKA/indicator/SH.STA.BASS.ZS?format=json&date=2010:2026
```

## Available WASH Indicators

| Code | Name | Description |
|------|------|-------------|
| `SH.STA.BASS.ZS` | Basic Sanitation | Population using at least basic sanitation services (% of population) |
| `SH.STA.SMSS.ZS` | Safely Managed Sanitation | Population using safely managed sanitation services (% of population) |
| `SH.H2O.SMDW.ZS` | Safely Managed Water | Population using safely managed drinking-water services (% of population) |
| `SH.H2O.BASW.ZS` | Basic Water | Population using at least basic drinking-water services (% of population) |

## Installation

### 1. Install Dependencies

```bash
npm install
```

The package.json includes axios for HTTP requests:
```json
{
  "dependencies": {
    "axios": "^1.7.0",
    ...
  }
}
```

### 2. Environment Configuration

Add these variables to your `.env` file:

```env
# World Bank API Configuration
WORLD_BANK_API_URL=https://api.worldbank.org/v2
WORLD_BANK_FORMAT=json
WORLD_BANK_PER_PAGE=100
WORLD_BANK_CACHE_TTL=3600

# Default Country
SRI_LANKA_COUNTRY_CODE=LKA
DEFAULT_WASH_INDICATOR=SH.STA.SMSS.ZS
```

## API Routes

### 1. Get Available Indicators

```http
GET /api/world-bank/indicators/available
```

**Response:**
```json
{
  "success": true,
  "indicators": [
    {
      "name": "basicSanitation",
      "code": "SH.STA.BASS.ZS",
      "description": "Population using at least basic sanitation services (% of population)"
    },
    {
      "name": "safelyManagedSanitation",
      "code": "SH.STA.SMSS.ZS",
      "description": "Population using safely managed sanitation services (% of population)"
    },
    ...
  ],
  "timestamp": "2026-02-27T10:30:45.123Z"
}
```

### 2. Get Specific Indicator Data

```http
GET /api/world-bank/indicators/:indicatorCode?country=LKA&dateRange=2010:2026
```

**Parameters:**
- `indicatorCode` (path): World Bank indicator code (e.g., `SH.STA.BASS.ZS`)
- `country` (query): ISO 3166-1 alpha-3 country code (default: `LKA`)
- `dateRange` (query): Date range in format `YYYY:YYYY` (default: `2010:2026`)

**Example:**
```bash
curl "http://localhost:5000/api/world-bank/indicators/SH.STA.BASS.ZS?country=LKA&dateRange=2010:2026"
```

**Response:**
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

### 3. Get All WASH Indicators for a Country

```http
GET /api/world-bank/country/:countryCode?dateRange=2010:2026&indicators=SH.STA.BASS.ZS,SH.H2O.SMDW.ZS
```

**Parameters:**
- `countryCode` (path): ISO 3166-1 alpha-3 country code
- `dateRange` (query): Date range (default: `2010:2026`)
- `indicators` (query): Comma-separated indicator codes (optional, returns all if omitted)

**Example:**
```bash
curl "http://localhost:5000/api/world-bank/country/LKA"
```

**Response:**
```json
{
  "success": true,
  "country": "LKA",
  "dateRange": "2010:2026",
  "indicators": {
    "SH.STA.BASS.ZS": [
      {
        "year": 2026,
        "value": 95.5,
        "countryCode": "LKA",
        "countryName": "Sri Lanka",
        ...
      }
    ],
    "SH.STA.SMSS.ZS": [
      ...
    ]
  },
  "timestamp": "2026-02-27T10:30:45.123Z"
}
```

### 4. Get Basic Sanitation Data

```http
GET /api/world-bank/sanitation/:countryCode?dateRange=2010:2026
```

**Example:**
```bash
curl "http://localhost:5000/api/world-bank/sanitation/LKA"
```

### 5. Get Safe Water Access Data

```http
GET /api/world-bank/water/:countryCode?dateRange=2010:2026
```

**Example:**
```bash
curl "http://localhost:5000/api/world-bank/water/LKA"
```

## File Structure

```
src/modules/world-bank/
├── world-bank.service.js          # Service layer - API calls and data formatting
├── world-bank.controller.js        # Controller layer - Request handling
├── world-bank.routes.js            # Route definitions
├── world-bank.validation.js        # Input validation schemas
├── world-bank.module.js            # Module exports
└── dto/
    └── world-bank.response.dto.js   # Data Transfer Objects
```

## Service Methods

### `WorldBankService.getIndicatorData(countryCode, indicatorCode, dateRange, options)`

Fetch indicator data for a specific country and indicator.

```javascript
const result = await WorldBankService.getIndicatorData('LKA', 'SH.STA.BASS.ZS', '2010:2026');
```

### `WorldBankService.getMultipleIndicators(countryCode, indicatorCodes, dateRange)`

Fetch multiple indicators for a country in a single request.

```javascript
const result = await WorldBankService.getMultipleIndicators(
  'LKA',
  ['SH.STA.BASS.ZS', 'SH.H2O.SMDW.ZS'],
  '2010:2026'
);
```

### `WorldBankService.getAvailableIndicators()`

Get list of all available WASH indicators.

```javascript
const indicators = await WorldBankService.getAvailableIndicators();
```

## Error Handling

The service includes comprehensive error handling with specific messages for different scenarios:

- **404 Not Found**: Country or indicator not found
- **400 Bad Request**: Invalid request parameters
- **429 Too Many Requests**: Rate limited by API
- **503 Service Unavailable**: API is temporarily down
- **504 Gateway Timeout**: Request timeout

**Error Response Example:**
```json
{
  "success": false,
  "country": "LKA",
  "indicator": "SH.STA.BASS.ZS",
  "error": "Country or indicator not found",
  "statusCode": 404,
  "timestamp": "2026-02-27T10:30:45.123Z"
}
```

## Response Format Standards

### Data Points

Each data point follows this structure:
```json
{
  "year": 2026,
  "value": 95.5,
  "countryCode": "LKA",
  "countryName": "Sri Lanka",
  "indicatorName": "Population using at least basic sanitation services (%)",
  "unit": "Percentage (%)",
  "source": "World Bank"
}
```

### Metadata

Includes information about the response:
```json
{
  "total": 17,
  "filtered": 17,
  "yearRange": {
    "from": 2010,
    "to": 2026
  },
  "lastUpdated": "2026-02-27T10:30:45.123Z",
  "source": "World Bank Open Data"
}
```

## Validation

All inputs are validated using Joi schema validation:

- **Indicator Code**: Must be 15 characters, uppercase with dots (e.g., `SH.STA.BASS.ZS`)
- **Country Code**: Must be 3 characters, ISO 3166-1 alpha-3 format (e.g., `LKA`)
- **Date Range**: Must be in format `YYYY:YYYY` (e.g., `2010:2026`)

## Best Practices Implemented

### 1. **Separation of Concerns**
   - Service layer handles API calls and data transformation
   - Controller handles HTTP request/response
   - Validation layer is separate

### 2. **Error Handling**
   - Comprehensive try-catch blocks
   - Detailed error messages with status codes
   - Proper HTTP status code responses

### 3. **Data Validation**
   - Input validation using Joi
   - Type checking and format validation
   - Custom error messages

### 4. **Response Format**
   - Consistent JSON structure
   - Metadata included for context
   - ISO 8601 timestamps
   - Source attribution

### 5. **Code Organization**
   - Clear file structure following module pattern
   - DTOs for type safety
   - Documented methods with JSDoc comments

### 6. **Performance**
   - Support for batch requests (multiple indicators)
   - Configurable timeout handling
   - Proper HTTP headers

### 7. **Documentation**
   - JSDoc comments on all functions
   - Comprehensive README
   - Example API calls
   - Clear parameter descriptions

## Usage Examples

### Node.js/JavaScript

```javascript
import WorldBankService from './modules/world-bank/world-bank.service.js';

// Get specific indicator
const result = await WorldBankService.getIndicatorData(
  'LKA',
  'SH.STA.BASS.ZS',
  '2010:2026'
);

console.log(result.data); // Array of yearly data points

// Get multiple indicators
const allData = await WorldBankService.getMultipleIndicators(
  'LKA',
  ['SH.STA.BASS.ZS', 'SH.H2O.SMDW.ZS']
);

console.log(allData.indicators); // Object with all indicators
```

### cURL

```bash
# Get available indicators
curl -X GET http://localhost:5000/api/world-bank/indicators/available

# Get basic sanitation data for Sri Lanka
curl -X GET "http://localhost:5000/api/world-bank/indicators/SH.STA.BASS.ZS?country=LKA&dateRange=2010:2026"

# Get all WASH data for a country
curl -X GET "http://localhost:5000/api/world-bank/country/LKA"

# Get sanitation data
curl -X GET "http://localhost:5000/api/world-bank/sanitation/LKA"

# Get water access data
curl -X GET "http://localhost:5000/api/world-bank/water/LKA"
```

## Testing

Example test cases:

```javascript
describe('WorldBankService', () => {
  it('should fetch indicator data successfully', async () => {
    const result = await WorldBankService.getIndicatorData('LKA', 'SH.STA.BASS.ZS');
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should handle invalid country code', async () => {
    expect(() => {
      WorldBankService.getIndicatorData('INVALID', 'SH.STA.BASS.ZS');
    }).toThrow();
  });

  it('should return formatted data with metadata', async () => {
    const result = await WorldBankService.getIndicatorData('LKA', 'SH.STA.BASS.ZS');
    expect(result.metadata).toBeDefined();
    expect(result.metadata.yearRange).toBeDefined();
  });
});
```

## Configuration

### Environment Variables

```env
# API Configuration
WORLD_BANK_API_URL=https://api.worldbank.org/v2
WORLD_BANK_FORMAT=json
WORLD_BANK_PER_PAGE=100
WORLD_BANK_CACHE_TTL=3600

# Country-specific defaults
SRI_LANKA_COUNTRY_CODE=LKA
DEFAULT_WASH_INDICATOR=SH.STA.SMSS.ZS
```

### Axios Configuration

Default request timeout: 10 seconds
User-Agent: Handwash-Plus/1.0

## Future Enhancements

- [ ] Add caching layer (Redis)
- [ ] Implement rate limiting
- [ ] Add webhook support for data updates
- [ ] Support for comparing multiple countries
- [ ] Data visualization endpoints
- [ ] Historical data archival
- [ ] Custom date range queries

## References

- [World Bank Open Data API](https://data.worldbank.org)
- [World Bank Data Catalog](https://data.worldbank.org/indicator)
- [SDG Indicators](https://sdgs.un.org/goals)
- [ISO 3166-1 Country Codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)

## Support

For issues or questions about this integration, please refer to the main project documentation or contact the development team.

---

**Last Updated:** February 27, 2026
**Version:** 1.0.0
**Status:** Production Ready
