
import jwt from 'jsonwebtoken';
import { config } from '../../config/environment.config.js';



export const generateToken = (payload) =>{
    const accessToken = jwt.sign(
        payload,
        config.jwt.secret,
        {expiresIn:config.jwt.accessExpiration}

    );

    const refreshToken = jwt.sign(
        {id:payload.id},
        config.jwt.refreshSecret,
        {expiresIn:config.jwt.refreshExpiration}
    )
    return {accessToken, refreshToken};
};

export const verifyToken = (token,isRefreshToken=false)=>{
 try{
    const secret = isRefreshToken ? config.jwt.refreshSecret : config.jwt.secret;
    return jwt.verify(token, secret);
 }catch(error){
     throw new Error('Invalid token');
 }
};

export const generateResetToken = (userId) =>{
    return jwt.sign(
        {userId},
        config.jwt.resetSecret,
        {expiresIn:'1h'}
    );
};



export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};