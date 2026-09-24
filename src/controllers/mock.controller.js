import MockService from "../services/mock.service.js";

class MockController {
    generateUsers(req, res, next) {
        try {
            const { quantity } = req.params;

            const users = MockService.generateUsers(quantity);

            res.status(200).json({
                status: "success",
                payload: users
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new MockController();