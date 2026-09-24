import Order from "../models/Order.js";

class OrderRepository {
    async findAll() {
        return Order.find().populate("customer");
    }

    async findById(id) {
        return Order.findById(id).populate("customer");
    }

    async create(orderData) {
        return Order.create(orderData);
    }

    async updateById(id, orderData) {
        return Order.findByIdAndUpdate(
            id,
            orderData,
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).populate("customer");
    }

    async deleteById(id) {
        return Order.findByIdAndDelete(id);
    }
}

export default new OrderRepository();