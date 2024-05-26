const request = require("supertest");
require('dotenv').config()
const { default: axios } = require("axios");

const express = require('express');
const app = require('../../index');
const { initializeLogger } = require('../../core/logging/logger');

describe("Test the /carriers path", () => {
    let token;
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
        const response = await agent
            .get("/carriers")
            // .set('Authorization', authHeader);
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

    });

    it('should return a list of carriers in JSON format', async () => {
        const response = await agent.get('/carriers').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.count).toBeGreaterThan(0);

        for (const carrier of response.body.data) {
            expect(carrier).toHaveProperty('id');
            expect(carrier).toHaveProperty('name');
            expect(carrier).toHaveProperty('email');
            expect(carrier).toHaveProperty('active');
            expect(carrier).toHaveProperty('image');
            expect(carrier).toHaveProperty('amountOfCharacters');
            expect(carrier).toHaveProperty('numOnly');
            expect(carrier).toHaveProperty('prefix');
        }
    });

    it('should return a carrier by ID in JSON format', async () => {
        const response = await agent.get('/carriers/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('active');
        expect(response.body).toHaveProperty('image');
        expect(response.body).toHaveProperty('amountOfCharacters');
        expect(response.body).toHaveProperty('numOnly');
        expect(response.body).toHaveProperty('prefix');
    });

    it('should return a 404 error when given an invalid carrier ID', async () => {
        const response = await agent.get('/carriers/999').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.type).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('message', 'The carrier with this id does not exist!');
    });

});