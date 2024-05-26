const request = require("supertest");
const express = require('express');
const app = require('../../index');

const {
    initializeLogger
} = require('../../core/logging/logger');

// a test to check if status endpoint is working
describe("Test the /products path", () => {
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
            .get("/products")
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });

    // get all products and note the total number of products
    // get all categories and for each category get the number of products
    // compare the total number of products with the sum of the number of products for each category

    it("should return the correct total number of products", async () => {
        const categories = await request(app).get("/product-categories");
        const totalProducts = await request(app).get("/products");
        let total = 0;

        for (const category of categories.body) {
            const products = await request(app).get(`/products?category=${category.categoryId}`);
            total += products.body.count;
        }
        expect(totalProducts.body.count).toBe(total);
    });

    // get all products and check that the language is either "en" or "nl"
    it("should return the correct language", async () => {
        const products = await request(app).get("/products");
        for (const product of products.body.items) {
            expect(["en", "nl"]).toContain(product.productDescription[0].languageId);
        }
    });

    // get all products and check that the each product is reachable via the product id
    it("should return the correct product", async () => {
        const products = await request(app).get("/products");
        for (const product of products.body.items) {
            const productById = await request(app).get(`/products/${product.productId}`);
            expect(productById.body.productId).toBe(product.productId);
        }
    });
});

