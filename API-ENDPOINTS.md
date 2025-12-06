# Tridala Nutra Foods - API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Overview
This document provides comprehensive documentation for all API endpoints in the Tridala Nutra Foods e-commerce backend. The API follows RESTful principles and returns JSON responses.

---

## Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication)
   - [Register User](#register-user)
   - [Login User](#login-user)
   - [Get User Profile](#get-user-profile)
3. [Categories](#categories)
   - [Get All Categories](#get-all-categories)
   - [Get Category by ID](#get-category-by-id)
   - [Get Category by Slug](#get-category-by-slug)
4. [Products](#products)
   - [Get All Products](#get-all-products)
   - [Get Product by ID](#get-product-by-id)
   - [Get Product by Slug](#get-product-by-slug)
   - [Get Products by Category](#get-products-by-category)
   - [Advanced Product Search](#advanced-product-search)
5. [Admin](#admin)
   - [Admin Products](#admin-products)
   - [Admin Categories](#admin-categories)
   - [Admin Orders](#admin-orders)
   - [Admin Users](#admin-users)

---

## Health Check

### Get Server Health Status

**Endpoint:** `GET /health`

**Description:** Check if the server is running and responsive.

**Authentication:** None

**Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T10:30:45.123Z",
  "uptime": 234.567
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Server is running and healthy |

---

## Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account with email and password.

**Authentication:** None (Public)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name (max 50 chars) |
| email | string | Yes | User's email address (must be unique) |
| password | string | Yes | Password (min 6 characters) |
| phone | string | No | User's phone number |

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "+919876543210"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "user",
    "createdAt": "2025-12-01T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Name, email, and password are required"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Email already registered. Please login or use a different email."
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 201 | User registered successfully |
| 400 | Missing or invalid required fields |
| 409 | Email already registered |
| 500 | Internal server error |

**Notes:**
- Password is hashed with bcrypt (10 rounds) before storage
- Email is converted to lowercase and trimmed
- Password is never returned in response
- JWT token is automatically generated and valid for 7 days

---

### Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with email and password to receive JWT token.

**Authentication:** None (Public)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's registered email |
| password | string | Yes | User's password |

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "user",
    "createdAt": "2025-12-01T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Login successful |
| 400 | Missing email or password |
| 401 | Invalid credentials |
| 500 | Internal server error |

**Notes:**
- Email is case-insensitive
- Password comparison uses bcrypt for security
- Generic error message for security (doesn't reveal if email exists)
- JWT token is valid for 7 days
- Store token on client side for authenticated requests

---

### Get User Profile

**Endpoint:** `GET /auth/me`

**Description:** Retrieve the current logged-in user's profile information. Protected route requiring JWT authentication.

**Authentication:** Required (JWT Bearer Token)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "user",
    "createdAt": "2025-12-01T10:30:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

**Error Response (401 Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Error Response (401 Expired Token):**
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Profile retrieved successfully |
| 401 | Missing, invalid, or expired token |
| 500 | Internal server error |

**Notes:**
- Token must be in `Authorization: Bearer <token>` format
- Token is valid for 7 days from login/registration
- Password is never included in response
- This endpoint verifies the token is still valid

---

## Categories

### Get All Categories

**Endpoint:** `GET /categories`

**Description:** Retrieve a list of all product categories in the system.

**Authentication:** None (Public)

**Query Parameters:** None

**Request:**
```bash
curl -X GET http://localhost:5000/api/categories \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Vitamin Supplements",
      "slug": "vitamin-supplements",
      "description": "Essential vitamins and minerals for optimal health",
      "createdAt": "2025-12-01T10:15:30.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Protein Powders",
      "slug": "protein-powders",
      "description": "High-quality protein supplements for muscle building",
      "createdAt": "2025-12-01T10:14:20.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Organic Foods",
      "slug": "organic-foods",
      "description": "100% organic and natural food products",
      "createdAt": "2025-12-01T10:13:10.000Z",
      "__v": 0
    }
  ]
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Categories retrieved successfully |
| 500 | Internal server error |

**Notes:**
- Categories are sorted by creation date (newest first)
- `count` field shows total number of categories returned
- `createdAt` is sorted in descending order

---

### Get Category by ID

**Endpoint:** `GET /categories/:id`

**Description:** Retrieve a single category by its MongoDB ObjectId.

**Authentication:** None (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of the category (24-character hex string) |

**Request:**
```bash
curl -X GET http://localhost:5000/api/categories/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vitamin Supplements",
    "slug": "vitamin-supplements",
    "description": "Essential vitamins and minerals for optimal health",
    "createdAt": "2025-12-01T10:15:30.000Z",
    "__v": 0
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid category ID format"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category with ID 507f1f77bcf86cd799439999 not found"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Category retrieved successfully |
| 400 | Invalid ID format (not a valid MongoDB ObjectId) |
| 404 | Category not found |
| 500 | Internal server error |

**Notes:**
- ID must be a valid 24-character MongoDB ObjectId (hexadecimal)
- Invalid formats (too short, invalid characters, etc.) will return 400
- Non-existent but valid IDs will return 404

---

### Get Category by Slug

**Endpoint:** `GET /categories/slug/:slug`

**Description:** Retrieve a single category by its URL-friendly slug. Useful for frontend navigation and SEO-friendly URLs.

**Authentication:** None (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | URL-friendly slug of the category (e.g., "vitamin-supplements") |

**Request:**
```bash
curl -X GET http://localhost:5000/api/categories/slug/vitamin-supplements \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vitamin Supplements",
    "slug": "vitamin-supplements",
    "description": "Essential vitamins and minerals for optimal health",
    "createdAt": "2025-12-01T10:15:30.000Z",
    "__v": 0
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Slug parameter is required"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category with slug \"invalid-slug\" not found"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Category retrieved successfully |
| 400 | Slug parameter is missing or empty |
| 404 | Category with given slug not found |
| 500 | Internal server error |

**Notes:**
- Slugs are case-insensitive and converted to lowercase
- Slug is auto-generated from category name during creation
- Example transformation: "Vitamin Supplements" → "vitamin-supplements"
- Special characters are removed and spaces are replaced with hyphens

---

## Products

### Get All Products

**Endpoint:** `GET /products`

**Description:** Retrieve a list of all products with support for filtering, searching, and sorting.

**Authentication:** None (Public)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category MongoDB ObjectId |
| search | string | Search in product name, tags, and description |
| sort | string | Sort by field: "price", "name", "createdAt", "stock". Use "-" prefix for descending (e.g., "-price") |
| limit | number | Limit results (default: 20, max: 100) |

**Request:**
```bash
curl -X GET "http://localhost:5000/api/products?category=507f1f77bcf86cd799439012&sort=-price&limit=10" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "total": 25,
  "limit": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Whey Protein Isolate",
      "slug": "whey-protein-isolate",
      "description": "Pure whey protein isolate for muscle building and recovery",
      "price": 2999,
      "salePrice": 2499,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Protein Powders",
        "slug": "protein-powders"
      },
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "weightOrSize": "500g",
      "stock": 150,
      "healthBenefits": [
        "Muscle building",
        "Recovery",
        "Energy boost"
      ],
      "tags": [
        "protein",
        "whey",
        "isolate",
        "fitness"
      ],
      "createdAt": "2025-12-01T10:15:30.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Casein Protein",
      "slug": "casein-protein",
      "description": "Slow-release casein protein for overnight recovery",
      "price": 2499,
      "salePrice": null,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Protein Powders",
        "slug": "protein-powders"
      },
      "images": ["https://example.com/casein.jpg"],
      "weightOrSize": "1kg",
      "stock": 200,
      "healthBenefits": ["Recovery", "Sleep support"],
      "tags": ["casein", "protein", "recovery"],
      "createdAt": "2025-12-01T10:14:20.000Z",
      "__v": 0
    }
  ]
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Products retrieved successfully |
| 400 | Invalid category ID or query parameters |
| 500 | Internal server error |

**Notes:**
- Products are sorted by creation date (newest first) by default
- `count` shows returned items, `total` shows all matching items
- `limit` is capped at 100 for performance
- Category filter requires valid MongoDB ObjectId
- Search is performed across name, tags, and description fields

---

### Get Product by ID

**Endpoint:** `GET /products/:id`

**Description:** Retrieve a single product by its MongoDB ObjectId.

**Authentication:** None (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of the product (24-character hex string) |

**Request:**
```bash
curl -X GET http://localhost:5000/api/products/507f1f77bcf86cd799439015 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Whey Protein Isolate",
    "slug": "whey-protein-isolate",
    "description": "Pure whey protein isolate for muscle building and recovery",
    "price": 2999,
    "salePrice": 2499,
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Protein Powders",
      "slug": "protein-powders",
      "description": "High-quality protein supplements for muscle building"
    },
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "weightOrSize": "500g",
    "stock": 150,
    "healthBenefits": [
      "Muscle building",
      "Recovery",
      "Energy boost"
    ],
    "tags": [
      "protein",
      "whey",
      "isolate",
      "fitness"
    ],
    "createdAt": "2025-12-01T10:15:30.000Z",
    "__v": 0
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid product ID format"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product with ID 507f1f77bcf86cd799439999 not found"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Product retrieved successfully |
| 400 | Invalid ID format (not a valid MongoDB ObjectId) |
| 404 | Product not found |
| 500 | Internal server error |

**Notes:**
- ID must be a valid 24-character MongoDB ObjectId
- Category details are populated in the response
- Includes all product information (images, benefits, tags, etc.)

---

### Get Product by Slug

**Endpoint:** `GET /products/slug/:slug`

**Description:** Retrieve a single product by its URL-friendly slug. Useful for SEO-friendly URLs.

**Authentication:** None (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | URL-friendly slug of the product (e.g., "whey-protein-isolate") |

**Request:**
```bash
curl -X GET http://localhost:5000/api/products/slug/whey-protein-isolate \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Whey Protein Isolate",
    "slug": "whey-protein-isolate",
    "description": "Pure whey protein isolate for muscle building and recovery",
    "price": 2999,
    "salePrice": 2499,
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Protein Powders",
      "slug": "protein-powders",
      "description": "High-quality protein supplements for muscle building"
    },
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "weightOrSize": "500g",
    "stock": 150,
    "healthBenefits": [
      "Muscle building",
      "Recovery",
      "Energy boost"
    ],
    "tags": [
      "protein",
      "whey",
      "isolate",
      "fitness"
    ],
    "createdAt": "2025-12-01T10:15:30.000Z",
    "__v": 0
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Slug parameter is required"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product with slug \"invalid-slug\" not found"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Product retrieved successfully |
| 400 | Slug parameter is missing or empty |
| 404 | Product with given slug not found |
| 500 | Internal server error |

**Notes:**
- Slugs are case-insensitive and converted to lowercase
- Slug is auto-generated from product name during creation
- Example transformation: "Whey Protein Isolate" → "whey-protein-isolate"
- Perfect for SEO-friendly product URLs

---

### Get Products by Category

**Endpoint:** `GET /products/category/:categoryId`

**Description:** Retrieve all products belonging to a specific category with filtering and sorting options.

**Authentication:** None (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| categoryId | string | MongoDB ObjectId of the category |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| sort | string | Sort by field: "price", "name", "createdAt", "stock". Use "-" prefix for descending |
| limit | number | Limit results (default: 20, max: 100) |

**Request:**
```bash
curl -X GET "http://localhost:5000/api/products/category/507f1f77bcf86cd799439012?sort=-price&limit=15" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "total": 12,
  "limit": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Whey Protein Isolate",
      "slug": "whey-protein-isolate",
      "price": 2999,
      "salePrice": 2499,
      "category": "507f1f77bcf86cd799439012",
      "images": ["https://example.com/image1.jpg"],
      "weightOrSize": "500g",
      "stock": 150,
      "healthBenefits": ["Muscle building", "Recovery"],
      "tags": ["protein", "whey"],
      "createdAt": "2025-12-01T10:15:30.000Z",
      "__v": 0
    }
  ]
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Products retrieved successfully |
| 400 | Invalid category ID format |
| 500 | Internal server error |

**Notes:**
- Category filter requires valid MongoDB ObjectId
- Products sorted by creation date (newest first) by default
- Useful for browsing products within a specific category

---

### Advanced Product Search

**Endpoint:** `GET /products/search/advanced`

**Description:** Perform advanced search with multiple filters including full-text search, price range, and category filtering.

**Authentication:** None (Public)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Full-text search query (searches name, tags, description) |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| category | string | Filter by category MongoDB ObjectId |

**Request:**
```bash
curl -X GET "http://localhost:5000/api/products/search/advanced?q=protein&minPrice=1000&maxPrice=5000&category=507f1f77bcf86cd799439012" \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Whey Protein Isolate",
      "slug": "whey-protein-isolate",
      "description": "Pure whey protein isolate for muscle building and recovery",
      "price": 2999,
      "salePrice": 2499,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Protein Powders",
        "slug": "protein-powders"
      },
      "images": ["https://example.com/image1.jpg"],
      "weightOrSize": "500g",
      "stock": 150,
      "healthBenefits": ["Muscle building", "Recovery"],
      "tags": ["protein", "whey", "isolate"],
      "createdAt": "2025-12-01T10:15:30.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Casein Protein Powder",
      "slug": "casein-protein-powder",
      "description": "Slow-release casein protein for overnight muscle recovery",
      "price": 2499,
      "salePrice": null,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Protein Powders",
        "slug": "protein-powders"
      },
      "images": ["https://example.com/casein.jpg"],
      "weightOrSize": "1kg",
      "stock": 200,
      "healthBenefits": ["Recovery", "Muscle support"],
      "tags": ["casein", "protein", "recovery"],
      "createdAt": "2025-12-01T10:14:20.000Z",
      "__v": 0
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid category ID format"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Search completed successfully |
| 400 | Invalid query parameters |
| 500 | Internal server error |

**Notes:**
- Search results are sorted by text relevance score
- Maximum 50 results returned from advanced search
- Price filters are inclusive (minPrice ≤ price ≤ maxPrice)
- All parameters are optional
- Search is case-insensitive
- Useful for e-commerce product filtering and browsing

---

## Product Schema Reference

### Product Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `name` | String | Yes | Product name (max 100 chars) |
| `slug` | String | Auto | URL-friendly slug (auto-generated) |
| `description` | String | No | Detailed product description (max 1000 chars) |
| `price` | Number | Yes | Regular price in rupees |
| `salePrice` | Number | No | Sale price (must be less than regular price) |
| `category` | ObjectId | Yes | Reference to Category model |
| `images` | Array[String] | No | Array of image URLs (max 10) |
| `weightOrSize` | String | No | Product weight or size (e.g., "500g", "1kg") |
| `stock` | Number | No | Available stock quantity (default: 0) |
| `healthBenefits` | Array[String] | No | Health benefits list (max 15 items) |
| `tags` | Array[String] | No | Search tags (max 20 items) |
| `createdAt` | Date | Auto | Timestamp of creation |

---

## Global Error Response Format

All error responses follow this standard format:

```json
{
  "success": false,
  "message": "Error description"
}
```

In development environment, additional debug information is included:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Error stack trace for debugging"
}
```

---

## Response Headers

All successful responses include the following headers:

```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=15552000; includeSubDomains
```

These headers are added by the Helmet security middleware.

---

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS). 

**Allowed Origins:** All origins (configurable via `CORS_ORIGIN` environment variable)

**Allowed Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:** Content-Type, Authorization

**Credentials:** Enabled

---

## Rate Limiting

Rate limiting is currently commented out but can be enabled by uncommenting the configuration in `app.js`:

- **Window:** 15 minutes
- **Limit:** 100 requests per IP per window

---

## HTTP Status Codes Used

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters or format |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Testing the API

### Using curl

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Get user profile (replace TOKEN with actual JWT token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get all categories
curl http://localhost:5000/api/categories

# Get category by ID
curl http://localhost:5000/api/categories/507f1f77bcf86cd799439011

# Get category by slug
curl http://localhost:5000/api/categories/slug/vitamin-supplements

# Get all products
curl http://localhost:5000/api/products

# Get all products with filters
curl "http://localhost:5000/api/products?category=507f1f77bcf86cd799439012&sort=-price&limit=10"

# Get product by ID
curl http://localhost:5000/api/products/507f1f77bcf86cd799439015

# Get product by slug
curl http://localhost:5000/api/products/slug/whey-protein-isolate

# Get products by category
curl http://localhost:5000/api/products/category/507f1f77bcf86cd799439012

# Advanced product search
curl "http://localhost:5000/api/products/search/advanced?q=protein&minPrice=1000&maxPrice=5000"

# Advanced search with category filter
curl "http://localhost:5000/api/products/search/advanced?q=protein&category=507f1f77bcf86cd799439012&minPrice=2000"
```

### Using Postman

1. Import the following URLs into Postman
2. Set method to GET
3. Click Send

**Collection:**
```
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/me
GET http://localhost:5000/api/health
GET http://localhost:5000/api/categories
GET http://localhost:5000/api/categories/507f1f77bcf86cd799439011
GET http://localhost:5000/api/categories/slug/vitamin-supplements
GET http://localhost:5000/api/products
GET http://localhost:5000/api/products?category=507f1f77bcf86cd799439012&sort=-price
GET http://localhost:5000/api/products/507f1f77bcf86cd799439015
GET http://localhost:5000/api/products/slug/whey-protein-isolate
GET http://localhost:5000/api/products/category/507f1f77bcf86cd799439012
GET http://localhost:5000/api/products/search/advanced?q=protein&minPrice=1000&maxPrice=5000
```

### Using JavaScript Fetch API

```javascript
// Register a new user
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  localStorage.setItem('token', data.token); // Store token
});

// Login user
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123'
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
  localStorage.setItem('token', data.token); // Store token
});

// Get user profile (with token)
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(response => response.json())
.then(data => console.log(data));

// Get all categories
fetch('http://localhost:5000/api/categories')
  .then(response => response.json())
  .then(data => console.log(data));

// Get category by ID
fetch('http://localhost:5000/api/categories/507f1f77bcf86cd799439011')
  .then(response => response.json())
  .then(data => console.log(data));

// Get category by slug
fetch('http://localhost:5000/api/categories/slug/vitamin-supplements')
  .then(response => response.json())
  .then(data => console.log(data));

// Get all products
fetch('http://localhost:5000/api/products')
  .then(response => response.json())
  .then(data => console.log(data));

// Get products with filters
fetch('http://localhost:5000/api/products?category=507f1f77bcf86cd799439012&sort=-price&limit=10')
  .then(response => response.json())
  .then(data => console.log(data));

// Get product by ID
fetch('http://localhost:5000/api/products/507f1f77bcf86cd799439015')
  .then(response => response.json())
  .then(data => console.log(data));

// Get product by slug
fetch('http://localhost:5000/api/products/slug/whey-protein-isolate')
  .then(response => response.json())
  .then(data => console.log(data));

// Advanced search
fetch('http://localhost:5000/api/products/search/advanced?q=protein&minPrice=1000&maxPrice=5000')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Authentication & Authorization

Currently, all endpoints are **public** and do not require authentication.

**Future Implementation:**
- JWT-based authentication will be added for protected routes
- Admin routes will require elevated privileges
- User routes will require user authentication

---

## Versioning

Current API Version: **v1** (implicit)

Future versions will be prefixed with `/api/v2/`, `/api/v3/`, etc.

---

## Environment Variables

```env
PORT=5000                                              # Server port
MONGO_URI=mongodb://localhost:27017/tridala-nutra-foods  # MongoDB connection URI
NODE_ENV=development                                   # Environment (development/production)
CORS_ORIGIN=*                                         # CORS allowed origin
```

---

## Request/Response Examples

### Example 1: Create Sample Categories (Future Feature)

This is a preview of how future POST endpoints will work:

```bash
POST /api/categories
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Vitamin Supplements",
  "description": "Essential vitamins and minerals for optimal health"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vitamin Supplements",
    "slug": "vitamin-supplements",
    "description": "Essential vitamins and minerals for optimal health",
    "createdAt": "2025-12-01T10:15:30.000Z"
  }
}
```

---

## Changelog

### Version 1.3.0 (2025-12-06)
- Added complete Admin module foundation (STEP 1)
- Admin authentication and role-based access control
- POST /api/admin/products - Create new product
- GET /api/admin/products - List all products (admin view)
- GET /api/admin/products/:id - Get product details (admin view)
- PUT /api/admin/products/:id - Update product
- DELETE /api/admin/products/:id - Delete product
- POST /api/admin/categories - Create category
- GET /api/admin/categories - List all categories (admin view)
- PUT /api/admin/categories/:id - Update category
- DELETE /api/admin/categories/:id - Delete category
- GET /api/admin/orders - List all orders
- GET /api/admin/orders/:id - Get order details
- PUT /api/admin/orders/:id/status - Update order status
- GET /api/admin/users - List all users
- GET /api/admin/users/:id - Get user details
- PUT /api/admin/users/:id/role - Update user role
- Admin middleware for role-based access control
- All admin endpoints protected with JWT authentication

### Version 1.2.0 (2025-12-01)
- Added complete Authentication module with JWT
- POST /api/auth/register - User registration with email/password
- POST /api/auth/login - User login with JWT token generation
- GET /api/auth/me - Protected endpoint to retrieve user profile
- Bcrypt password hashing with 10 salt rounds
- JWT token valid for 7 days
- Auth middleware for protecting routes
- Email validation and uniqueness checks
- Secure password comparison
- User schema with name, email, phone, and role fields

### Version 1.1.0 (2025-12-01)
- Added Product module with full GET operations
- GET /api/products - Fetch all products with filtering, searching, and sorting
- GET /api/products/:id - Get product by MongoDB ObjectId
- GET /api/products/slug/:slug - Get product by SEO-friendly slug
- GET /api/products/category/:categoryId - Get products by category
- GET /api/products/search/advanced - Advanced search with price range filters
- Product-Category relationship (populated in responses)
- Full-text search indexing on product name, tags, and description
- Support for sorting by price, name, creation date, and stock
- Query parameter validation and security

### Version 1.0.0 (2025-12-01)
- Initial API setup
- Health check endpoint
- Category GET endpoints (all, by ID, by slug)
- Global error handling
- CORS and security headers configured

### Upcoming Features
- PUT /api/auth/profile (Update profile - Protected)
- POST /api/categories (Create category - Admin only)
- PUT /api/categories/:id (Update category - Admin only)
- DELETE /api/categories/:id (Delete category - Admin only)
- POST /api/products (Create product - Admin only)
- PUT /api/products/:id (Update product - Admin only)
- DELETE /api/products/:id (Delete product - Admin only)
- Order management
- Shopping cart
- Reviews and ratings
- Password reset functionality

---

## Admin

> **Important:** All admin endpoints require authentication with an admin-role user. Include the JWT token in the Authorization header.

### Authentication Requirement

All admin endpoints require:
- Valid JWT token in `Authorization: Bearer <token>` header
- User must have `role: 'admin'` in their account

**Example Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 401 | Missing or invalid authentication token |
| 403 | User does not have admin privileges |

---

### Admin Products

#### Create Product

**Endpoint:** `POST /admin/products`

**Description:** Create a new product (Admin only).

**Authentication:** Required (Admin only)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name (max 100 chars) |
| description | string | Yes | Product description |
| price | number | Yes | Regular product price |
| salePrice | number | No | Discounted price (must be < price) |
| category | string | Yes | Category ID (MongoDB ObjectId) |
| stock | number | Yes | Available quantity |
| tags | array | No | Product tags for filtering |
| image | string | No | Product image URL |

**Request:**
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Organic Whey Protein",
    "description": "High-quality organic whey protein powder",
    "price": 2500,
    "salePrice": 1999,
    "category": "507f1f77bcf86cd799439011",
    "stock": 50,
    "tags": ["protein", "whey", "organic"],
    "image": "https://example.com/product.jpg"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "Organic Whey Protein",
    "description": "High-quality organic whey protein powder",
    "price": 2500,
    "salePrice": 1999,
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Proteins"
    },
    "stock": 50,
    "tags": ["protein", "whey", "organic"],
    "image": "https://example.com/product.jpg",
    "slug": "organic-whey-protein",
    "createdAt": "2025-12-06T10:30:45.123Z",
    "updatedAt": "2025-12-06T10:30:45.123Z"
  }
}
```

---

#### Get All Products (Admin View)

**Endpoint:** `GET /admin/products`

**Description:** List all products with admin-specific details (Admin only).

**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| search | string | Search by name or tags |
| category | string | Filter by category ID |
| sort | string | Sort field (e.g., price, -stock) |

**Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/products?page=1&limit=20&search=protein" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "name": "Organic Whey Protein",
      "price": 2500,
      "salePrice": 1999,
      "stock": 50,
      "category": "507f1f77bcf86cd799439011",
      "createdAt": "2025-12-06T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

#### Get Product by ID (Admin View)

**Endpoint:** `GET /admin/products/:id`

**Description:** Get detailed admin view of a specific product (Admin only).

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID (MongoDB ObjectId) |

**Request:**
```bash
curl -X GET http://localhost:5000/api/admin/products/507f1f77bcf86cd799439021 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "Organic Whey Protein",
    "description": "High-quality organic whey protein powder",
    "price": 2500,
    "salePrice": 1999,
    "stock": 50,
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Proteins"
    },
    "tags": ["protein", "whey", "organic"],
    "slug": "organic-whey-protein",
    "createdAt": "2025-12-06T10:30:45.123Z",
    "updatedAt": "2025-12-06T10:30:45.123Z"
  }
}
```

---

#### Update Product

**Endpoint:** `PUT /admin/products/:id`

**Description:** Update an existing product (Admin only).

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID (MongoDB ObjectId) |

**Request Body:** (All fields optional)
```bash
curl -X PUT http://localhost:5000/api/admin/products/507f1f77bcf86cd799439021 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium Organic Whey Protein",
    "price": 2700,
    "stock": 45
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "Premium Organic Whey Protein",
    "price": 2700,
    "stock": 45,
    "updatedAt": "2025-12-06T11:45:30.123Z"
  }
}
```

---

#### Delete Product

**Endpoint:** `DELETE /admin/products/:id`

**Description:** Delete a product permanently (Admin only).

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID (MongoDB ObjectId) |

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/admin/products/507f1f77bcf86cd799439021 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "Organic Whey Protein"
  }
}
```

---

### Admin Categories

#### Create Category

**Endpoint:** `POST /admin/categories`

**Description:** Create a new product category (Admin only).

**Authentication:** Required (Admin only)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Category name (max 50 chars) |
| description | string | No | Category description |
| image | string | No | Category image URL |

**Request:**
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Supplements",
    "description": "Nutritional supplements and vitamins",
    "image": "https://example.com/supplements.jpg"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Supplements",
    "description": "Nutritional supplements and vitamins",
    "slug": "supplements",
    "image": "https://example.com/supplements.jpg",
    "createdAt": "2025-12-06T10:30:45.123Z"
  }
}
```

---

#### Get All Categories (Admin View)

**Endpoint:** `GET /admin/categories`

**Description:** List all categories with admin details (Admin only).

**Authentication:** Required (Admin only)

**Request:**
```bash
curl -X GET http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "name": "Supplements",
      "description": "Nutritional supplements and vitamins",
      "slug": "supplements",
      "createdAt": "2025-12-06T10:30:45.123Z"
    }
  ]
}
```

---

#### Update Category

**Endpoint:** `PUT /admin/categories/:id`

**Description:** Update an existing category (Admin only).

**Authentication:** Required (Admin only)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/admin/categories/507f1f77bcf86cd799439030 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium Supplements",
    "description": "High-quality nutritional supplements"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Premium Supplements",
    "slug": "premium-supplements"
  }
}
```

---

#### Delete Category

**Endpoint:** `DELETE /admin/categories/:id`

**Description:** Delete a category permanently (Admin only).

**Authentication:** Required (Admin only)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/admin/categories/507f1f77bcf86cd799439030 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Supplements"
  }
}
```

---

### Admin Orders

#### Get All Orders

**Endpoint:** `GET /admin/orders`

**Description:** List all orders in the system (Admin only).

**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| status | string | Filter by order status |
| search | string | Search by order ID or user email |

**Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/orders?status=pending&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "userId": "507f1f77bcf86cd799439020",
      "totalAmount": 5000,
      "status": "pending",
      "createdAt": "2025-12-06T09:15:30.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

---

#### Get Order by ID

**Endpoint:** `GET /admin/orders/:id`

**Description:** Get detailed view of a specific order (Admin only).

**Authentication:** Required (Admin only)

**Request:**
```bash
curl -X GET http://localhost:5000/api/admin/orders/507f1f77bcf86cd799439040 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "userId": "507f1f77bcf86cd799439020",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439021",
        "quantity": 2,
        "price": 1999
      }
    ],
    "totalAmount": 5000,
    "status": "pending",
    "shippingAddress": "123 Main St, City, Country",
    "createdAt": "2025-12-06T09:15:30.123Z"
  }
}
```

---

#### Update Order Status

**Endpoint:** `PUT /admin/orders/:id/status`

**Description:** Update the status of an order (Admin only).

**Authentication:** Required (Admin only)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | New status (pending, processing, shipped, delivered, cancelled) |

**Request:**
```bash
curl -X PUT http://localhost:5000/api/admin/orders/507f1f77bcf86cd799439040/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "status": "shipped",
    "updatedAt": "2025-12-06T11:45:30.123Z"
  }
}
```

---

### Admin Users

#### Get All Users

**Endpoint:** `GET /admin/users`

**Description:** List all users in the system (Admin only).

**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| role | string | Filter by role (admin, user) |
| search | string | Search by email or name |

**Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/users?role=user&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+919876543210",
      "createdAt": "2025-12-01T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 234
  }
}
```

---

#### Get User by ID

**Endpoint:** `GET /admin/users/:id`

**Description:** Get detailed view of a specific user (Admin only).

**Authentication:** Required (Admin only)

**Request:**
```bash
curl -X GET http://localhost:5000/api/admin/users/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+919876543210",
    "createdAt": "2025-12-01T10:30:45.123Z",
    "updatedAt": "2025-12-01T10:30:45.123Z"
  }
}
```

---

#### Update User Role

**Endpoint:** `PUT /admin/users/:id/role`

**Description:** Change a user's role (Admin only).

**Authentication:** Required (Admin only)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| role | string | Yes | New role (admin, user) |

**Request:**
```bash
curl -X PUT http://localhost:5000/api/admin/users/507f1f77bcf86cd799439020/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "role": "admin"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "email": "john@example.com",
    "role": "admin",
    "updatedAt": "2025-12-06T11:45:30.123Z"
  }
}
```

---

## Support & Contact

For API issues or questions, please contact:
- **Development Team:** Tridala Development Team
- **Email:** dev@tridalanutrafoods.com

---

## License

This API is part of the Tridala Nutra Foods e-commerce platform and is proprietary.

---

**Last Updated:** December 1, 2025  
**Maintained By:** Tridala Development Team
