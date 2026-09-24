import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";

import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

describe("Orders API", () => {
    before(async () => {
        await connectDatabase();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it("debería crear una orden y calcular el total automáticamente", async () => {
        const uniqueEmail = `order-${Date.now()}@shipnow.com`;

        await request(app)
            .post("/api/users")
            .send({
                firstName: "Order",
                lastName: "Test",
                email: uniqueEmail,
                password: "Test1234",
            });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: uniqueEmail,
                password: "Test1234",
            });

        const token = loginResponse.body.data.token;

        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                items: [
                    {
                        name: "Fernet",
                        quantity: 2,
                        price: 20000,
                    },
                    {
                        name: "Coca Cola",
                        quantity: 1,
                        price: 3000,
                    },
                ],
                deliveryAddress: "San Luis 123",
                priority: "high",
                total: 1,
            });

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body.data).to.have.property("_id");

        expect(response.body.data.total).to.equal(43000);
        expect(response.body.data.total).to.not.equal(1);

        expect(response.body.data.items).to.have.lengthOf(2);
        expect(response.body.data.priority).to.equal("high");
        expect(response.body.data.deliveryAddress).to.equal("San Luis 123");
    });

    it("debería rechazar que un customer modifique una orden", async () => {
        const uniqueEmail = `order-update-${Date.now()}@shipnow.com`;

        await request(app)
            .post("/api/users")
            .send({
                firstName: "Customer",
                lastName: "Test",
                email: uniqueEmail,
                password: "Test1234",
            });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: uniqueEmail,
                password: "Test1234",
            });

        const token = loginResponse.body.data.token;

        const orderResponse = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                items: [
                    {
                        name: "Fernet",
                        quantity: 1,
                        price: 20000,
                    },
                ],
                deliveryAddress: "San Luis 456",
            });

        const orderId = orderResponse.body.data._id;

        const response = await request(app)
            .put(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                priority: "high",
            });

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Insufficient permissions");
    });
});