import { generateMockUsers } from "../mocks/user.mock.js";
import InvalidMockQuantityError from "../utils/errors/InvalidMockQuantityError.js";

class MockService {
    generateUsers(quantity) {
        const parsedQuantity = Number(quantity);

        if (
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity <= 0
        ) {
            throw new InvalidMockQuantityError(
                "Mock quantity must be a positive integer"
            );
        }

        return generateMockUsers(parsedQuantity);
    }
}

export default new MockService();