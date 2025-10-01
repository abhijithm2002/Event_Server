// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { IAuthController } from "./interfaces/IuserController.js";
import UserService from "../service/user.service.js";

export default class UserController implements IAuthController {
    private authService: UserService;

    constructor() {
        this.authService = new UserService();
    }

    async userSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password, confirmPassword, role } = req.body;

            await this.authService.signup(name, email, password, role);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error: any) {
            console.error("Error in userSignup:", error);
            res.status(400).json({ message: error.message || "An error occurred during signup" });
        }
    }

    async userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            console.log('req body', req.body);

            const result = await this.authService.login(email, password);

            console.log('result. success', result.message)
            if (!result.success) {
                res.status(400).json({ message: result.message });
                return;
            }

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ message: result.message, user: result.user, accessToken: result.accessToken });
        } catch (error: any) {
            console.error("Error in userLogin:", error);
            res.status(500).json({ message: "An error occurred during login" });
        }
    }

}
