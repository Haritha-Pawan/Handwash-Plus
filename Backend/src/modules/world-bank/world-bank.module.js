import WorldBankController from './world-bank.controller.js';
import WorldBankService from './world-bank.service.js';
import WorldBankRoutes from './world-bank.routes.js';
import {
  validateIndicatorQuery,
  validateCountryCode,
  validateBatchIndicators
} from './world-bank.validation.js';


export const WorldBankModule = {
  controller: WorldBankController,
  service: WorldBankService,
  routes: WorldBankRoutes,
  validators: {
    validateIndicatorQuery,
    validateCountryCode,
    validateBatchIndicators
  }
};

export default WorldBankModule;
