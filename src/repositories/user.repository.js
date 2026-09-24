import User from "../models/User.js";

class UserRepository {
    async findAll() {
        return User.find().select("-password");
    }

    async findById(id) {
        return User.findById(id).select("-password");
    }

    async findByEmail(email) {
        return User.findOne({ email }).select("-password");
    }

    async findByEmailWithPassword(email) {
        return User.findOne({ email }).select("+password");
    }

    async create(userData) {
        return User.create(userData);
    }

    async updateById(id, userData) {
        return User.findByIdAndUpdate(
            id,
            userData,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );
    }

    async deleteById(id) {
        return User.findByIdAndDelete(id);
    }
}

export default new UserRepository();