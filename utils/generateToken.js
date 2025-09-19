import { SignJWT } from 'jose';
import { JWT_SECRET } from './getJWTSECRET.js';

export async function generateToken(payload, expierssIn = '15m') {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expierssIn)
    .sign(JWT_SECRET);
  return token;
}
