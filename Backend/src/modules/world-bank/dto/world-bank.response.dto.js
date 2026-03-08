
export class IndicatorDataDTO {
  constructor(data) {
    this.year = data.year;
    this.value = data.value;
    this.countryCode = data.countryCode;
    this.countryName = data.countryName;
    this.indicatorName = data.indicatorName;
    this.unit = data.unit || 'Percentage (%)';
    this.source = data.source || 'World Bank';
  }

  toJSON() {
    return {
      year: this.year,
      value: this.value,
      countryCode: this.countryCode,
      countryName: this.countryName,
      indicatorName: this.indicatorName,
      unit: this.unit,
      source: this.source
    };
  }
}


export class IndicatorResponseDTO {
  constructor(apiResponse) {
    this.success = apiResponse.success === true;
    this.country = apiResponse.country;
    this.indicator = apiResponse.indicator;
    this.data = (apiResponse.data || []).map(item => new IndicatorDataDTO(item));
    this.metadata = apiResponse.metadata || {};
    this.timestamp = apiResponse.timestamp;
  }

  toJSON() {
    return {
      success: this.success,
      country: this.country,
      indicator: this.indicator,
      data: this.data.map(item => item.toJSON()),
      metadata: this.metadata,
      timestamp: this.timestamp
    };
  }
}

export class AvailableIndicatorDTO {
  constructor(data) {
    this.name = data.name;
    this.code = data.code;
    this.description = data.description;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      description: this.description
    };
  }
}


export class CountryWASHResponseDTO {
  constructor(apiResponse) {
    this.success = apiResponse.success === true;
    this.country = apiResponse.country;
    this.dateRange = apiResponse.dateRange;
    this.indicators = apiResponse.indicators || {};
    this.timestamp = apiResponse.timestamp;
  }

  toJSON() {
    return {
      success: this.success,
      country: this.country,
      dateRange: this.dateRange,
      indicators: this.indicators,
      timestamp: this.timestamp
    };
  }
}

export default {
  IndicatorDataDTO,
  IndicatorResponseDTO,
  AvailableIndicatorDTO,
  CountryWASHResponseDTO
};
