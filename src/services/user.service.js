import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { USER_ROLES } from "../constants/user.constants.js";
import userRepository from "../repositories/user.repository.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import InvalidDataError from "../utils/errors/InvalidDataError.js";
import env from "../config/env.js";


class UserService {
    async getAllUsers() {
        return userRepository.findAll();
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }

    async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new InvalidDataError("User email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userToCreate = {
        ...userData,
        password: hashedPassword,
        role: USER_ROLES.CUSTOMER,
    };

    const createdUser = await userRepository.create(userToCreate);

    const userResponse = createdUser.toObject();
    delete userResponse.password;

    return userResponse;
}

    async updateUser(id, userData) {
    await this.getUserById(id);

    if (userData.email) {
        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser && existingUser._id.toString() !== id) {
            throw new InvalidDataError("User email already exists");
        }
    }

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    return userRepository.updateById(id, userData);
    }

    async deleteUser(id) {
        await this.getUserById(id);

        return userRepository.deleteById(id);
    }

    async loginUser(email, password) {
        const user = await userRepository.findByEmailWithPassword(email);

        if (!user) {
            throw new InvalidDataError("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new InvalidDataError("Invalid email or password");
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            env.jwtSecret,
            {
                expiresIn: "1h",
            }
        );

        const userResponse = user.toObject();

        delete userResponse.password;

        return {
            user: userResponse,
            token,
        };
    }
}

export default new UserService();