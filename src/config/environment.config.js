import dotenv from 'dotenv';


dotenv.config();


export const config = {
    env:process.env.NODE_ENV || 'development',
    port:process.env.PORT||5000,

    jwt:{
        secret:process.env.JWT_SECRET,
        refershSecret:process.env.JWT+_REFERSH_SECRET,
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