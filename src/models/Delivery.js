import mongoose from "mongoose";
import { TRACKING_STATUS } from "../constants/tracking.constants.js";
import { ORDER_PRIORITY } from "../constants/order.constants.js";

const trackingHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: Object.values(TRACKING_STATUS),
            required: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const deliverySchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        status: {
            type: String,
            enum: Object.values(TRACKING_STATUS),
            default: TRACKING_STATUS.PREPARING,
        },

        priority: {
            type: String,
            enum: Object.values(ORDER_PRIORITY),
            default: ORDER_PRIORITY.NORMAL,
        },

        trackingHistory: {
            type: [trackingHistorySchema],
            default: [],
        },

        proof: {
            originalName: {
            type: String,
            },

            fileName: {
            type: String,
        },

            path: {
            type: String,
        },

            mimeType: {
            type: String,
        },

            size: {
            type: Number,
        },

            uploadedAt: {
            type: Date,
        },
    },
    },
    {
        timestamps: true,
    }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;