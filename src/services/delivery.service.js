import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import { TRACKING_STATUS } from "../constants/tracking.constants.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import InvalidDataError from "../utils/errors/InvalidDataError.js";

class DeliveryService {
    async getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    async getDeliveryById(id) {
        const delivery = await deliveryRepository.findById(id);

        if (!delivery) {
            throw new NotFoundError("Delivery not found");
        }
        
        return delivery;
    }

    async createDelivery(deliveryData) {
        const order = await orderRepository.findById(deliveryData.order);

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        if (deliveryData.driver) {
    const driver = await userRepository.findById(deliveryData.driver);

        if (!driver) {
            throw new NotFoundError("Driver not found");
        }

        if (driver.role !== "driver") {
            throw new InvalidDataError("User is not a driver");
        }
    }

        const initialStatus =
            deliveryData.status || TRACKING_STATUS.PREPARING;

        const deliveryToCreate = {
            ...deliveryData,
            status: initialStatus,
            trackingHistory: [
                {
                    status: initialStatus,
                    timestamp: new Date(),
                },
            ],
        };

        return deliveryRepository.create(deliveryToCreate);
    }

    async updateDeliveryStatus(id, newStatus) {
        const delivery = await this.getDeliveryById(id);

        const validStatuses = Object.values(TRACKING_STATUS);

        if (!validStatuses.includes(newStatus)) {
            throw new InvalidDataError("Invalid tracking status");
        }

        const trackingHistory = [
            ...delivery.trackingHistory,
            {
                status: newStatus,
                timestamp: new Date(),
            },
        ];

        return deliveryRepository.updateStatus(
            id,
            newStatus,
            trackingHistory
        );
    }

    async updateDelivery(id, deliveryData) {
        await this.getDeliveryById(id);

        return deliveryRepository.updateById(id, deliveryData);
    }

    async uploadProof(id, file) {
        await this.getDeliveryById(id);

        if (!file) {
            throw new InvalidDataError("Proof file is required");
        }

        const proof = {
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
        };

        return deliveryRepository.updateById(id, { proof });
    }

    async deleteDelivery(id) {
        await this.getDeliveryById(id);

        return deliveryRepository.deleteById(id);
    }
}

export default new DeliveryService();