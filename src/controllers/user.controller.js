import userService from "../services/user.service.js";

class UserController {
    async getAll(req, res) {
        const users = await userService.getAllUsers();

        res.json({
            status: "success",
            data: users,
        });
    }

    async getById(req, res) {
        const user = await userService.getUserById(req.params.id);

        res.json({
            status: "success",
            data: user,
        });
    }

    async create(req, res) {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            status: "success",
            data: user,
        });
    }

    async update(req, res) {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        res.json({
            status: "success",
            data: user,
        });
    }

    async delete(req, res) {
        await userService.deleteUser(req.params.id);

        res.status(204).send();
    }

    async login(req, res) {
    const { email, password } = req.body;

    const user = await userService.loginUser(email, password);

    res.json({
        status: "success",
        data: user,
    });
    }
}

export default new UserController();