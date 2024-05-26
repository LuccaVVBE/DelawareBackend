const request = require("supertest");
require('dotenv').config()
const { default: axios } = require("axios");

const express = require('express');
const app = require('../../index');
const {
    initializeLogger
} = require('../../core/logging/logger');

const companyService = require('../../service/company.js');
let token;

describe("Test the /notifications path", () => {
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
            .get("/notifications")
            .set('Authorization', `Bearer ${token}`)

            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });

    /*
    This test ensures that the GET /notifications endpoint of our API returns a list of notifications in the correct format. The test checks that the response has a status code of 200, 
    is in JSON format, and contains at least one notification object in the response body. The test also checks that each notification object in the response has 
    the expected properties (id, title, message, read). This test serves as a basic sanity check to ensure that our API is returning data in the expected format and is ready for more comprehensive testing.
    */

    it('should return a list of notifications in JSON format', async () => {
        const response = await agent.get('/notifications').set('Authorization', `Bearer ${token}`)
            ;
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0]).toHaveProperty('id');
        expect(response.body.data[0]).toHaveProperty('title');
        expect(response.body.data[0]).toHaveProperty('description');
        expect(response.body.data[0]).toHaveProperty('read');
    });


    it("should mark the notification as read", async () => {
        // since the test user is working for company 1, we can use that to get the notifications
        const notifications = await companyService.getNotificationsById("1");
        const notification = notifications.items[0];
        const result = await agent
            .put(`/notifications/${notification.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');

        expect(result.body.read).toBe(true);
    });

    it("should get all notifications for a specific company", async () => {
        const result = await agent
            .get("/companies/1/notifications")
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');
        expect(result.body.count).toBeGreaterThan(0);
    });

});