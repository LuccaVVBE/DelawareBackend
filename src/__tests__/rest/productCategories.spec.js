const request = require("supertest");

const express = require('express');
const app = require('../../index');

const {
    initializeLogger
} = require('../../core/logging/logger');

// a test to check if status endpoint is working
describe("Test the /product-categories path", () => {
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

    it("should respond with status code 200", async () => {
        return request(app)
            .get("/product-categories")
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });

    it('should return a list of product categories in JSON format', async () => {
        const response = await request(app).get('/product-categories');
        expect(response.status).toBe(200);
        expect(response.type).toMatch(/application\/json/);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('categoryId');
        expect(response.body[0]).toHaveProperty('categoryName');
    });

    // get all product categories and check that the each category is reachable via its category id
    it("should return the correct category", async () => {
        const categories = await request(app).get("/product-categories");
        for (const category of categories.body) {
            const categoryById = await request(app).get(`/product-categories/${category.categoryId}`);
            expect(categoryById.body.categoryId).toBe(category.categoryId);
        }
    });


});

