import dotenv from 'dotenv';


dotenv.config();


export const config = {
    env:process.env.NODE_ENV || 'development',
    port:process.env.PORT||5000,

    jwt:{
        secret:process.env.JWT_SECRET,
        refreshSecret:process.env.JWT_REFRESH_SECRET,
        resetSecret:process.env.JWT_RESET_SECRET,
        accessExpiration:process.env.JWT_ACCESS_EXPIRATION_MINUTES|| '15m',
        refreshExpiration:process.env.JWT_REFRESH_EXPIRATION_DAYS || '7d',
    },


    database:{
        url:process.env.MONGODB_URI,
        option:{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        }
    },

    cors:{
        origin:process.env.CORS_ORIGIN?.split(',')||['http://localhost:3000'],
        Credential:true,
    }

};


export const washConfig = {
  worldBank: {
    baseURL: process.env.WORLD_BANK_API_URL || 'https://api.worldbank.org/v2',
    format: process.env.WORLD_BANK_FORMAT || 'json',
    perPage: parseInt(process.env.WORLD_BANK_PER_PAGE) || 100,
    cacheTTL: parseInt(process.env.WORLD_BANK_CACHE_TTL) || 3600
  },
  sriLanka: {
    countryCode: process.env.SRI_LANKA_COUNTRY_CODE || 'LKA',
    defaultIndicator: process.env.DEFAULT_WASH_INDICATOR || 'SH.STA.SMSS.ZS'
  },
  indicators: {
    safelyManagedSanitation: 'SH.STA.SMSS.ZS',
    basicSanitation: 'SH.STA.BASS.ZS',
    safelyManagedWater: 'SH.H2O.SMDW.ZS',
    basicWater: 'SH.H2O.BASW.ZS',
    ruralSanitation: 'SH.STA.SMSS.RU.ZS',
    urbanSanitation: 'SH.STA.SMSS.UR.ZS'
  }
};