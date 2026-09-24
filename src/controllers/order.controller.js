import orderService from "../services/order.service.js";

class OrderController {
    async getAll(req, res) {
        const orders = await orderService.getAllOrders();

        res.json({
            status: "success",
            data: orders,
        });
    }

    async getById(req, res) {
    const order = await orderService.getOrderById(
        req.params.id,
        req.user
    );

    res.json({
        status: "success",
        data: order,
    });
    }
    
    async create(req, res) {
    const order = await orderService.createOrder(
        req.body,
        req.user.id
    );

    res.status(201).json({
        status: "success",
        data: order,
    });
}
    async update(req, res) {
        const order = await orderService.updateOrder(
            req.params.id,
            req.body
        );

        res.json({
            status: "success",
            data: order,
        });
    }

    async delete(req, res) {
        await orderService.deleteOrder(req.params.id);

        res.status(204).send();
    }
}

export default new OrderController();