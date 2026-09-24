import Delivery from "../models/Delivery.js";

class DeliveryRepository {
    async findAll() {
        return Delivery.find()
            .populate("order")
            .populate("driver");
    }

    async findById(id) {
        return Delivery.findById(id)
            .populate("order")
            .populate("driver");
    }

    async create(deliveryData) {
        return Delivery.create(deliveryData);
    }

    async updateById(id, deliveryData) {
        return Delivery.findByIdAndUpdate(
            id,
            deliveryData,
            {
                returnDocument: "after",
                runValidators: true,
            }
        )
            .populate("order")
            .populate("driver");
    }

    async updateStatus(id, status, trackingHistory) {
        return Delivery.findByIdAndUpdate(
            id,
            {
                status,
                trackingHistory,
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        )
            .populate("order")
            .populate("driver");
    }

    async deleteById(id) {
        return Delivery.findByIdAndDelete(id);
    }
}

export default new DeliveryRepository();