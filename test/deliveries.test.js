import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";
import User from "../src/models/User.js";

describe("Deliveries API", () => {
    before(async () => {
        await connectDatabase();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it("debería crear una entrega y actualizar su estado manteniendo el historial", async () => {
        const customerEmail = `delivery-customer-${Date.now()}@shipnow.com`;

        await request(app)
            .post("/api/users")
            .send({
                firstName: "Delivery",
                lastName: "Customer",
                email: customerEmail,
                password: "Test1234",
            });

        const customerLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: customerEmail,
                password: "Test1234",
            });

        const customerToken = customerLogin.body.data.token;

        const orderResponse = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({
                items: [
                    {
                        name: "Fernet",
                        quantity: 1,
                        price: 20000,
                    },
                ],
                deliveryAddress: "San Luis 789",
            });

        const orderId = orderResponse.body.data._id;

        const admin = await User.create({
            firstName: "Test",
            lastName: "Admin",
            email: `delivery-admin-${Date.now()}@shipnow.com`,
            password: await bcrypt.hash("Test1234", 10),
            role: "admin",
        });

        const adminLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: admin.email,
                password: "Test1234",
            });

        const adminToken = adminLogin.body.data.token;

        const deliveryResponse = await request(app)
            .post("/api/deliveries")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                order: orderId,
                priority: "high",
            });

        expect(deliveryResponse.status).to.equal(201);
        expect(deliveryResponse.body.status).to.equal("success");

        const delivery = deliveryResponse.body.data;

        expect(delivery).to.have.property("_id");
        expect(delivery.status).to.equal("En preparación");
        expect(delivery.priority).to.equal("high");
        expect(delivery.trackingHistory).to.have.lengthOf(1);
        expect(delivery.trackingHistory[0].status).to.equal(
            "En preparación"
        );

        const statusResponse = await request(app)
            .patch(`/api/deliveries/${delivery._id}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                status: "Enviado",
            });

        expect(statusResponse.status).to.equal(200);
        expect(statusResponse.body.status).to.equal("success");

        const updatedDelivery = statusResponse.body.data;

        expect(updatedDelivery.status).to.equal("Enviado");
        expect(updatedDelivery.trackingHistory).to.have.lengthOf(2);

        expect(updatedDelivery.trackingHistory[0].status).to.equal(
            "En preparación"
        );

        expect(updatedDelivery.trackingHistory[1].status).to.equal(
            "Enviado"
        );
    });

    it("debería rechazar un archivo con formato no permitido", async () => {
        const customerEmail = `proof-customer-${Date.now()}@shipnow.com`;

        await request(app)
            .post("/api/users")
            .send({
                firstName: "Proof",
                lastName: "Customer",
                email: customerEmail,
                password: "Test1234",
            });

        const customerLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: customerEmail,
                password: "Test1234",
            });

        const customerToken = customerLogin.body.data.token;

        const orderResponse = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({
                items: [
                    {
                        name: "Fernet",
                        quantity: 1,
                        price: 20000,
                    },
                ],
                deliveryAddress: "San Luis 999",
            });

        const orderId = orderResponse.body.data._id;

        const admin = await User.create({
            firstName: "Proof",
            lastName: "Admin",
            email: `proof-admin-${Date.now()}@shipnow.com`,
            password: await bcrypt.hash("Test1234", 10),
            role: "admin",
        });

        const adminLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: admin.email,
                password: "Test1234",
            });

        const adminToken = adminLogin.body.data.token;

        const deliveryResponse = await request(app)
            .post("/api/deliveries")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                order: orderId,
            });

        const deliveryId = deliveryResponse.body.data._id;

        const response = await request(app)
            .post(`/api/deliveries/${deliveryId}/proof`)
            .set("Authorization", `Bearer ${adminToken}`)
            .attach("proof", Buffer.from("archivo no permitido"), {
                filename: "archivo.txt",
                contentType: "text/plain",
            });

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Invalid file type");
    });

    it("debería rechazar un archivo que supere los 5 MB", async () => {
        const customerEmail = `size-customer-${Date.now()}@shipnow.com`;

        await request(app)
            .post("/api/users")
            .send({
                firstName: "Size",
                lastName: "Customer",
                email: customerEmail,
                password: "Test1234",
            });

        const customerLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: customerEmail,
                password: "Test1234",
            });

        const customerToken = customerLogin.body.data.token;

        const orderResponse = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({
                items: [
                    {
                        name: "Fernet",
                        quantity: 1,
                        price: 20000,
                    },
                ],
                deliveryAddress: "San Luis 111",
            });

        const orderId = orderResponse.body.data._id;

        const admin = await User.create({
            firstName: "Size",
            lastName: "Admin",
            email: `size-admin-${Date.now()}@shipnow.com`,
            password: await bcrypt.hash("Test1234", 10),
            role: "admin",
        });

        const adminLogin = await request(app)
            .post("/api/users/login")
            .send({
                email: admin.email,
                password: "Test1234",
            });

        const adminToken = adminLogin.body.data.token;

        const deliveryResponse = await request(app)
            .post("/api/deliveries")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                order: orderId,
            });

        const deliveryId = deliveryResponse.body.data._id;

        const largeFile = Buffer.alloc(5 * 1024 * 1024 + 1);

        const response = await request(app)
            .post(`/api/deliveries/${deliveryId}/proof`)
            .set("Authorization", `Bearer ${adminToken}`)
            .attach("proof", largeFile, {
                filename: "archivo-grande.pdf",
                contentType: "application/pdf",
            });

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal(
            "File size exceeds the 5 MB limit"
        );
    });
});