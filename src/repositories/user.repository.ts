// src/repositories/userRepository.ts
import { IUser } from "../model/interfaces/modal.interfaces.js";
import { UserModel } from "../model/user.model.js";

export default class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }
}
