
import { Request, Response, NextFunction } from "express";

export interface IAuthController {
    userSignup(req: Request, res: Response, next: NextFunction): Promise<void>;
    userLogin(req: Request, res: Response, next: NextFunction): void;
}
