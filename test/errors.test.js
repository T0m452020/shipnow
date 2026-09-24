import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";
import User from "../src/models/User.js";

describe("Error handling", () => {
    before(async () => {
        await connectDatabase();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it("debería rechazar un ID inválido", async () => {
        const admin = await User.create({
            firstName: "Error",
            lastName: "Test",
            email: `error-admin-${Date.now()}@shipnow.com`,
            password: await bcrypt.hash("Test1234", 10),
            role: "admin",
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: admin.email,
                password: "Test1234",
            });

        const token = loginResponse.body.data.token;

        const response = await request(app)
            .get("/api/orders/123")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Invalid ID");
    });

    it("debería devolver 404 para una ruta inexistente", async () => {
        const response = await request(app)
            .get("/api/ruta-que-no-existe");

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Route not found");
    });
});