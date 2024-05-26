const request = require("supertest");
require('dotenv').config()
const { default: axios } = require("axios");

const express = require('express');
const app = require('../../index');
const {
    initializeLogger
} = require('../../core/logging/logger');

const orderService = require('../../service/order');
let token;

describe("Test the /orders path", () => {
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
            .get("/orders")
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });

    it('should return a list of orders in JSON format', async () => {
        const response = await agent.get('/orders').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body.items.length).toBeGreaterThan(0);
        expect(response.body.count).toBeGreaterThan(0);
        expect(response.body.items[0]).toHaveProperty('orderId');
        expect(response.body.items[0]).toHaveProperty('packingType');
        expect(response.body.items[0]).toHaveProperty('companyId');
        expect(response.body.items[0]).toHaveProperty('addressId');
        expect(Array.isArray(response.body.items[0].orderItems)).toBe(true);
    });

    it('should return a single order in JSON format', async () => {
        const orderId = "2";
        const response = await request(app).get(`/orders/${orderId}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('orderId');
        expect(response.body).toHaveProperty('orderDate');
        expect(response.body).toHaveProperty('companyId');
        expect(response.body).toHaveProperty('addressId');
        expect(response.body).toHaveProperty('packingType');
        expect(response.body).toHaveProperty('orderItems');
        expect(Array.isArray(response.body.orderItems)).toBe(true);
        expect(response.body.orderId).toBe(orderId);
    });

    it('should create a new order', async () => {
        const response = await agent
            .post("/orders")
            .set('Authorization', `Bearer ${token}`)
            .send({
                orderDateTime: '2023-03-24T20:36:13.777Z',
                companyId: '1',
                address: {
                    country: 'Belgium',
                    zipCode: 9000,
                    city: 'Ghent',
                    street: 'straat',
                    number: '1'
                },
                packingType: 'Tailor made cardboard',
                orderItems: [
                    {
                        productId: 'EL004',
                        quantity: 1
                    },
                    {
                        productId: 'BP001',
                        quantity: 2
                    },
                    {
                        productId: 'EL002',
                        quantity: 1
                    }
                ]
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('orderId');
        expect(response.body).toHaveProperty('companyId');
        expect(response.body).toHaveProperty('addressId');
        expect(response.body).toHaveProperty('packingType');
    });

    // it should update an order's address
    it('should update an order', async () => {
        const order = await orderService.createOrder({
            orderDateTime: '2023-03-24T20:36:13.777Z',
            companyId: '1',
            address: {
                country: 'Belgium',
                zipCode: 9000,
                city: 'Ghent',
                street: 'straat',
                number: '1'
            },
            packingType: 'Tailor made cardboard',
            orderItems: [
                {
                    productId: 'EL004',
                    quantity: 1
                },
                {
                    productId: 'BP001',
                    quantity: 2
                },
                {
                    productId: 'EL002',
                    quantity: 1
                }
            ]
        });

        const response = await agent
            .put(`/orders/${order.orderId}`)
            .send({
                "addressId": "1",
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('orderId');
        expect(response.body).toHaveProperty('companyId');
        expect(response.body).toHaveProperty('addressId');
        expect(response.body).toHaveProperty('packingType');

        expect(response.body.addressId).not.toBe(order.addressId);
    });


    // creates a new order via the order service and delete it via the route
    // control if the order is deleted via the returned response
    it('should delete an order', async () => {
        const order = await orderService.createOrder({
            orderDateTime: '2023-03-24T20:36:13.777Z',
            companyId: '1',
            address: {
                country: 'Belgium',
                zipCode: 9000,
                city: 'Ghent',
                street: 'straat',
                number: '1'
            },
            packingType: 'Tailor made cardboard',
            orderItems: [
                {
                    productId: 'EL004',
                    quantity: 1
                },
                {
                    productId: 'BP001',
                    quantity: 2
                },
                {
                    productId: 'EL002',
                    quantity: 1
                }
            ]
        });
        const response = await agent
            .delete(`/orders/${order.orderId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('orderId');
        expect(response.body).toHaveProperty('companyId');
        expect(response.body).toHaveProperty('addressId');
        expect(response.body).toHaveProperty('packingType');
    });
});