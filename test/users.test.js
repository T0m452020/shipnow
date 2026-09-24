import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";

import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

describe("Users API", () => {
    before(async () => {
        await connectDatabase();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it("debería registrar un nuevo usuario correctamente", async () => {
        const uniqueEmail = `test-${Date.now()}@shipnow.com`;

        const response = await request(app)
            .post("/api/users")
            .send({
                firstName: "Test",
                lastName: "User",
                email: uniqueEmail,
                password: "Test1234",
            });

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body.data).to.have.property("_id");
        expect(response.body.data.email).to.equal(uniqueEmail);
        expect(response.body.data).to.not.have.property("password");
    });

    it("debería iniciar sesión y devolver un JWT", async () => {
        const uniqueEmail = `login-${Date.now()}@shipnow.com`;

        await request(app)
            .post("/api/users")
            .send({
                firstName: "Login",
                lastName: "Test",
                email: uniqueEmail,
                password: "Test1234",
            });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: uniqueEmail,
                password: "Test1234",
            });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.data).to.have.property("token");
        expect(response.body.data.token).to.be.a("string");
        expect(response.body.data.user.email).to.equal(uniqueEmail);
        expect(response.body.data.user).to.not.have.property("password");
    });

    it("debería rechazar el acceso de un customer a un endpoint de admin", async () => {
        const uniqueEmail = `customer-${Date.now()}@shipnow.com`;

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

        const response = await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Insufficient permissions");
    });
});