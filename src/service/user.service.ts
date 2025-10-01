// src/services/authService.ts
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository.js";
import generateJwt, { Payload } from "../middleware/jwt.js";
import { IUser } from "../model/interfaces/modal.interfaces.js";

type UserRole = IUser["role"];

export default class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signup(name: string, email: string, password: string, role: UserRole): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let organizer = await this.userRepository.createUser({
            name,
            email,
            passwordHash: hashedPassword,
            role
        });

        console.log('organiser', organizer)
    }

    async login(email: string, password: string): Promise<{
        success: boolean;
        message: string;
        user?: IUser;
        accessToken?: string;
        refreshToken?: string;
    }> {
        const userData = await this.userRepository.findByEmail(email);
        if (!userData) {
            return { success: false, message: "Email is incorrect" };
        }

        const isMatch = await bcrypt.compare(password, userData.passwordHash as string);
        if (!isMatch) {
            return { success: false, message: "Password is incorrect" };
        }

        const { accessToken, refreshToken } = await generateJwt(userData as Payload);

        return {
            success: true,
            message: "Logged in successfully",
            user: userData,
            accessToken,
            refreshToken,
        };
    }

}
