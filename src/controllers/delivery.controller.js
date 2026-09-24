import deliveryService from "../services/delivery.service.js";

class DeliveryController {
    async getAll(req, res) {
        const deliveries = await deliveryService.getAllDeliveries();

        res.json({
            status: "success",
            data: deliveries,
        });
    }

    async getById(req, res) {
        const delivery = await deliveryService.getDeliveryById(
            req.params.id
        );

        res.json({
            status: "success",
            data: delivery,
        });
    }

    async create(req, res) {
        const delivery = await deliveryService.createDelivery(req.body);

        res.status(201).json({
            status: "success",
            data: delivery,
        });
    }

    async update(req, res) {
        const delivery = await deliveryService.updateDelivery(
            req.params.id,
            req.body
        );

        res.json({
            status: "success",
            data: delivery,
        });
    }

    async updateStatus(req, res) {
        const delivery = await deliveryService.updateDeliveryStatus(
            req.params.id,
            req.body.status
        );

        res.json({
            status: "success",
            data: delivery,
        });
    }

    async uploadProof(req, res) {
        const delivery = await deliveryService.uploadProof(
            req.params.id,
            req.file
        );

        res.json({
            status: "success",
            data: delivery,
        });
    }

    async delete(req, res) {
        await deliveryService.deleteDelivery(req.params.id);

        res.status(204).send();
    }
}

export default new DeliveryController();