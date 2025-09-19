import dotenv from 'dotenv';

dotenv.config();

//encode secret key to Uint8Array
export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
