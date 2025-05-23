// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authenticate = async (req) => {
  let user = null;

  // Check for JWT token in Authorization header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; // Gets token from "Bearer TOKEN"

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true },
      });
    } catch (err) {
      console.error('JWT Authentication error:', err.message);
    }
  }

  return user;
};

export { authenticate };
