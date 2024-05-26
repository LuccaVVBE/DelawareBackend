const request = require("supertest");
require('dotenv').config()
const { default: axios } = require("axios");

const express = require('express');
const app = require('../../index');
const {
    initializeLogger
} = require('../../core/logging/logger');
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
        app.use(express.json());
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
    });

    it("should respond with status code 200", async () => {
        return agent
            .get("/companies")
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });

    it('should return a list of companies in JSON format', async () => {
        const response = await agent.get('/companies').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return a company by id in JSON format', async () => {
        const companyId = '1';
        const response = await agent.get(`/companies/${companyId}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
        expect(response.body.id).toBe(companyId);
    });

    it('GET /companies/:id/employees should return a list of employees in JSON format', async () => {
        const companyId = '1'; // replace with a valid company id
        const response = await agent.get(`/companies/${companyId}/employees`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('GET /companies/:id/orders should return a list of orders in JSON format', async () => {
        const companyId = '1'; // replace with a valid company id
        const response = await agent.get(`/companies/${companyId}/orders`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('GET /companies/:id/notifications should return a list of notifications in JSON format', async () => {
        const companyId = '1'; // replace with a valid company id
        const response = await agent.get(`/companies/${companyId}/notifications`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body.items)).toBe(true);
    });
});