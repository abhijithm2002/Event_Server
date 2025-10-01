import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join("./src", "./env") });

export interface JwtPayload {
  userId?: string;
  email?: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const verifyJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY_SECRET as string) as JwtPayload;

    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: err.message });
  }
};
