import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import NotFoundError from "../utils/errors/NotFoundError.js";

class OrderService {
    async getAllOrders() {
        return orderRepository.findAll();
    }

    async getOrderById(id, user = null) {
    const order = await orderRepository.findById(id);

    if (!order) {
        throw new NotFoundError("Order not found");
    }

    if (
        user &&
        user.role === "customer" &&
        order.customer._id.toString() !== user.id
    ) {
        throw new NotFoundError("Order not found");
    }

    return order;
}

    async createOrder(orderData, customerId) {
    const customer = await userRepository.findById(customerId);

    if (!customer) {
        throw new NotFoundError("Customer not found");
    }

    const total = orderData.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    const orderToCreate = {
        ...orderData,
        customer: customerId,
        total,
    };

    return orderRepository.create(orderToCreate);
}

    async updateOrder(id, orderData) {
        await this.getOrderById(id);

        if (orderData.items) {
            orderData.total = orderData.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            );
        }

        const updatedOrder = await orderRepository.updateById(id, orderData);

        if (!updatedOrder) {
            throw new NotFoundError("Order not found");
        }

        return updatedOrder;
    }

    async deleteOrder(id) {
        await this.getOrderById(id);

        return orderRepository.deleteById(id);
    }
}

export default new OrderService();