<!-- NOTE: modify this file based on your project specifications-->

# E-COMMERCE API DOCUMENTATION

## Introduction

Welcome to the E-Commerce API documentation. This API allows you to manage users, products, shopping carts, and orders in an e-commerce system.

## Installation

To install the required dependencies, use the following command:

```bash
npm install
```

## TEST ACCOUNTS:
- **Regular User:**
     - email: user123@mail.com
     - password: user123
- **Admin User:**
    - email: admin123@mail.com
    - password: admin123
    

## ROUTES:
- **User registration (POST)**
	- Endpoint: http://localhost:4000/users/register
  - Auth Header Required: No
  - Request Body: 
    - firstName (string)
    - lastName (string)
    - email (string)
    - password (string)
    - mobileNo (string)

- **User authentication (POST)**
	- Endpoint: http://localhost:4000/users/login
  - Auth Header Required: No
  - Request Body: 
    - email (string)
    - password (string)

- **Retrieve User Details (GET)**
  - Endpoint: http://localhost:4000/users/details/
  - Auth Header Required: Yes
  - Request Body: *None*
- **Set User As Admin (Admin Only) (POST)**
  - Endpoint: http://localhost:4000/users/set-user-admin
  - Auth Header Required: Yes
  - Request Body:
    - userId (string)
- **Create Product (Admin only) (POST)**
	- Endpoint: http://localhost:4000/products/add-product
  - Auth Header Required: Yes
  - Request Body: 
    - name (string)
    - description (string)
    - price (number)
- **Retrieve all products (GET)**
	- Endpoint: http://localhost:4000/products/all
  - Auth Header Required: No
  - Request Body: *None*
- **Retrieve all active products (GET)**
	- Endpoint: http://localhost:4000/products/all-active
  - Auth Header Required: No
	- Request Body: *None*
- **Retrieve single product (GET)**
  - Endpoint: http://localhost:4000/products/:productId
  - Auth Header Required: No
  - Request Body: *None*
- **Update a product (Admin Only) (PUT)**
  - Endpoint: http://localhost:4000/products/:productId
  - Auth Header Required: Yes
  - Request Body:
    - name (string)
    - description (string)
    - price (number)
- **Archiving a product (Admin Only) (PUT)**
  - Endpoint: http://localhost:4000/products/archive/:productId
  - Auth Header Required: Yes
  - Request Body: *None*
- **Activating a product (Admin Only) (PUT)**
  - Endpoint: http://localhost:4000/products/activate/:productId
  - Auth Header Required: Yes
  - Request Body: *None*
  
- **Adding product to cart (POST)**
  - Endpoint: http://localhost:4000/carts/add
  - Auth Header Required: Yes
  - Request Body:
    - productId (string)
    - quantity (number)
- **Updating quantity in cart (PUT)**
  - Endpoint: http://localhost:4000/carts/update
  - Auth Header Required: Yes
  - Request Body:
    - productId (string)
    - quantity (number)
- **Removing product from cart (DELETE)**
  - Endpoint: http://localhost:4000/carts/remove/:productId
  - Auth Header Required: Yes
  - Request Body: *None*
- **Retrieving authenticated user's orders (GET)**
  - Endpoint: http://localhost:4000/carts/
  - Auth Header Required: Yes
  - Request Body: *None*
- **Creating order / checking out (POST)**
  - Endpoint: http://localhost:4000/orders/checkout/
  - Auth Header Required: Yes
  - Request Body:
    - cartId (string)
- **Retrieving user's order (Order History) (GET)**
  - Endpoint: http://localhost:4000/orders/user-orders
  - Auth Header Required: Yes
  - Request Body: *None*
- **Retrieve all orders (Admin Only) (GET)**
  - Endpoint: http://localhost:4000/orders/all-orders
  - Auth Header Required: Yes
  - Request Body: *None*
