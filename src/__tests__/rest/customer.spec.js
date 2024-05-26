const request = require("supertest");
require('dotenv').config()
const { default: axios } = require("axios");

const express = require('express');
const app = require('../../index');
const {
    initializeLogger
} = require('../../core/logging/logger');
const customerService = require('../../service/customer.js');


let token;

describe("Test the /customers path", () => {
    const agent = request.agent(`http://localhost:${process.env.port}`);

    beforeAll(async () => {
        initializeLogger({
            level: "info",
            disabled: false,
            defaultMeta: {
                NODE_ENV: "development"
            },
        });
        const response = await axios.post("https://sdp2-g15.eu.auth0.com/oauth/token", {
            grant_type: 'password',
            username: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
            audience: process.env.AUTH_CLIENT_AUDIENCE,
            scope: 'openid profile email offline_access',
            client_id: process.env.AUTH_AUDIENCE,
            client_secret: process.env.AUTH_CLIENT_SECRET,
        }, {
            headers: {
                "Accept-Encoding": "gzip,deflate,compress"
            }
        });

        token = response.data.access_token;
        app.use(express.json());
    });

    it("GET /Customers should respond with status code 200", async () => {
        return agent
            .get("/customers")
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });

    // test for GET /customers/:id
    it("GET /Customers/:id should respond with status code 200, and return the correct customer", async () => {
        const customers = await customerService.getAll("1");
        const customer = customers.data[0];
        const response = await agent
            .get(`/customers/${customer.customerId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(customer);
    });
});