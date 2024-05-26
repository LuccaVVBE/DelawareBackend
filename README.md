# 2023-backend-gent15

- To make the backend work, follow these steps:
    * yarn install
        - if you get an error, it is most likely that you do not have yarn installed. Check for a command appropriate to your system.
    
    * create an .env file for all the enviromental variables
        - NODE_ENV = development/production(depending on which configs you wish to see)
        - port = [whatever port you want the API to listen to]
        - DATABASE_URL = mysql://USER:PASSWORD@HOST:PORT/DATABASE
        (e.g. DATABASE_URL = mysql://root:password@localhost:3306/test)
        - AUTH_JWKS_URI = AUTH0_TENANT_NAME/.well-known/jwks.json
        - AUTH_AUDIENCE = AUTH0_AUDIENCE
        - AUTH_ISSUER = AUTH0_TENANT_NAME/
        - AUTH_USERINFO = AUTH0_TENANT_NAME/userinfo
        - TEST_USER_EMAIL = Email of the test user
        - TEST_USER_PASSWORD = Password of the test user

    * create a folder called **seed** in prisma folder and put all the seed data/scripts in 
    * execute this command to create and seed the database:
        - ``` npx prisma migrate dev ```    (**Make sure that the database server is up and running before running this command.**)
    * If the database is not seeded, run this command:
        - ``` npx prisma db seed ```
    * **Be careful!** If your database server doesn't allow you to create a second, **shadow** database, migrate command will not work. Then you will have to follow these steps in the root folder: 
        - ``` npx prisma generate ```
        - ``` npx prisma db push ```
        - ``` npx prisma db seed ```
- To test the application, run the following command and make sure that the server is up and running:
    - ``` yarn test ```
  
---
## ENDPOINTS

### PRODUCTS ENDPOINTS
| HTTP Request | Route                       | Description                                                      |
| ------------ | --------------------------- | ---------------------------------------------------------------- |
| GET          | /products?language&category | Gets all products, optionally filtered by langugage and category |
| GET          | /products/:id?language      | Gets a product by id, optionally filtered by langugage           |


### PRODUCT CATEGORIES ENDPOINTS
| HTTP Request | Route                   | Description                   |
| ------------ | ----------------------- | ----------------------------- |
| GET          | /product-categories     | Gets all product categories   |
| GET          | /product-categories/:id | Gets a product category by id |

### CUSTOMERS ENDPOINTS
| HTTP Request | Route          | Description           |
| ------------ | -------------- | --------------------- |
| GET          | /customers     | Gets all customers    |
| GET          | /customers/:id | Gets a customer by id |


### NOTIFICATION ENDPOINTS
| HTTP Request | Route              | Description                  |
| ------------ | ------------------ | ---------------------------- |
| GET          | /notifications     | Gets all notifications       |
| GET          | /notifications/:id | Gets a notification by id    |
| PUT          | /notifications/:id | Marks a notification as read |

### ORDER ENDPOINTS
| HTTP Request | Route       | Description                    |
| ------------ | ----------- | ------------------------------ |
| GET          | /orders     | Gets all orders                |
| GET          | /orders/:id | Gets an order by id            |
| POST         | /orders     | Creates an order (orderBody)   |
| PUT          | /orders/:id | Edits an order (orderBodyEdit) |
| DELETE       | /orders/:id | Deletes an order               |

orderBody: (either address or addressId in one request)
```json
{
    "orderDateTime": "2023-03-24T20:36:13.777Z",
    "customerId": "customer1",
    "companyId": "company1",
    "address": {
        "country": "Belgium",
        "zipCode": 9000,
        "city": "Ghent",
        "street": "straat",
        "number": "1"
    },
    "packingType": "Tailor made cardboard",
        "orderItems": [
        {
            "productId": "EL004",
            "quantity": 1
        },
        {
            "productId": "BP001",
            "quantity": 2
        },
        {
            "productId": "EL002",
            "quantity": 1
        }
    ]
}
```

orderBodyEdit: (either address or addressId in one request, packingType can always be included. All optional) 
```json
{
    "address": {
        "country": "Belgium",
        "zipCode": 9000,
        "city": "Ghent",
        "street": "straat",
        "number": "1"
    },
    "addressId": "1",
    "packingType": "Tailor made cardboard"
}
```

### CARRIER ENDPOINTS
| HTTP Request | Route         | Description          |
| ------------ | ------------- | -------------------- |
| GET          | /carriers     | Gets all carriers    |
| GET          | /carriers/:id | Gets a carrier by id |

### TRACK ENDPOINTS
| HTTP Request | Route                                    | Description                        |
| ------------ | ---------------------------------------- | ---------------------------------- |
| GET          | /track?trackingNumber&confirmationNumber | Gets the t&t with the given values |

### COMPANIES ENDPOINTS
| HTTP Request | Route                             | Description                                                               |
| ------------ | --------------------------------- | ------------------------------------------------------------------------- |
| GET          | /companies                        | Gets all companies                                                        |
| GET          | /companies/:id                    | Gets a company by id                                                      |
| GET          | /companies/:id/employees          | Gets all employees of a company                                           |
| GET          | /companies/:id/orders             | Gets all orders of a company                                              |
| GET          | /companies/:id/notifications?read | Gets all notifications of a company (read=false for unread notifications) |