const request = require("supertest");

const express = require('express');
const app = require('../../index');
const {
    initializeLogger
} = require('../../core/logging/logger');

describe("Test the /track path", () => {
    beforeAll(() => {
        initializeLogger({
            level: "info",
            disabled: false,
            defaultMeta: {
                NODE_ENV: "development"
            },
        });

        app.use(express.json());
    });

    it("should return the correct t&t for the given tracking and confirmation numbers", async () => {
        const trackingNumber = "010511234567890";
        const confirmationNumber = "2565";
        const response = await request(app).get(`/track?trackingNumber=${trackingNumber}&confirmationNumber=${confirmationNumber}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("number", trackingNumber);
        expect(response.body).toHaveProperty("verificationCode", confirmationNumber);
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("carrierId");
        expect(response.body).toHaveProperty("orderId");
    });

    it("should return 404 for wrong tracking and confirmation numbers", async () => {
        const trackingNumber = "0";
        const confirmationNumber = "0";
        const response = await request(app).get(`/track?trackingNumber=${trackingNumber}&confirmationNumber=${confirmationNumber}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "server");
        expect(response.body).toHaveProperty("message");

    });
});