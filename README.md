# 🛒 Ecommerce Microservices Platform

A **microservices-based ecommerce platform** designed to provide a complete online shopping experience with separate applications for customers, vendors, and administrators.

The platform supports product browsing, shopping carts, orders, payments, inventory, reviews, invoices, shipping, refunds, notifications, and vendor management.

The backend is organized into independent services, with each service responsible for a specific business capability.

---

## 🚀 Project Overview

The platform provides separate interfaces for three types of users:

### 🛍️ Customers

Customers can:

* Register and login
* Browse products
* Search products
* View product details
* Manage shopping carts
* Checkout
* Make payments
* Place and manage orders
* Track shipments
* Download invoices
* Submit product ratings and reviews
* Manage their profile

### 🏪 Vendors

Vendors can:

* Register with username/email and password
* Login to the vendor application
* Check vendor approval status
* Access the vendor dashboard after approval
* Create products
* Update products
* Manage their products
* Manage inventory
* View orders
* View vendor analytics

A vendor must be **approved by an administrator before creating products**.

### 👨‍💼 Administrators

Administrators can:

* Login to the admin dashboard
* View vendor registrations
* Review vendor applications
* Approve vendors
* Reject vendors
* Manage users
* Manage products
* Manage orders
* View analytics
* Perform platform administration

---

# 🏪 Vendor Registration & Approval Workflow

Vendor onboarding follows an admin approval process.

```text
                 Vendor
                   │
                   ▼
          Vendor Registration
                   │
          Username + Password
                   │
                   ▼
                PENDING
                   │
                   ▼
          Admin Reviews Vendor
              /           \
             /             \
            ▼               ▼
        APPROVED         REJECTED
            │               │
            ▼               ▼
      Vendor Login      Access Restricted
            │
            ▼
     Vendor Dashboard
            │
            ▼
      Create Product
```

### 1. Vendor Registration

The vendor registers through the Vendor Dashboard.

```text
http://localhost:5173
```

The registration form includes:

```text
Username
Email
Password
Confirm Password
```

After registration, the vendor account is created with:

```text
status = PENDING
```

The vendor cannot create products while the account is pending.

---

### 2. Admin Review

The administrator logs into the Admin Dashboard:

```text
http://localhost:5174
```

The admin can view pending vendor applications.

Example:

| Vendor     | Email                                       | Status   | Action           |
| ---------- | ------------------------------------------- | -------- | ---------------- |
| ABC Store  | [abc@example.com](mailto:abc@example.com)   | PENDING  | Approve / Reject |
| XYZ Store  | [xyz@example.com](mailto:xyz@example.com)   | APPROVED | —                |
| Demo Store | [demo@example.com](mailto:demo@example.com) | REJECTED | —                |

---

### 3. Vendor Approval

If the administrator approves the application:

```text
PENDING
   │
   ▼
APPROVED
```

The vendor can then log in and access vendor functionality.

---

### 4. Vendor Rejection

If the administrator rejects the application:

```text
PENDING
   │
   ▼
REJECTED
```

The vendor cannot access protected vendor operations such as product creation.

---

# 📦 Product Creation Workflow

Only an **approved vendor** can create products.

```text
Approved Vendor
      │
      ▼
Vendor Login
      │
      ▼
Vendor Dashboard
      │
      ▼
Add Product
      │
      ▼
API Gateway
      │
      ▼
Product Service
      │
      ▼
PostgreSQL
```

A product contains information such as:

```text
Product Name
Description
Price
Stock
Category
Images
Vendor ID
```

Each product is associated with the vendor who created it.

```text
Product
├── id
├── vendorId
├── name
├── description
├── price
├── stock
├── category
└── images
```

---

# 🛡️ Vendor Authorization

Vendor authentication and vendor approval are separate checks.

For protected vendor operations, the backend verifies:

```text
JWT Valid?
    │
    ▼
Role = VENDOR?
    │
    ▼
Vendor Exists?
    │
    ▼
Vendor Status = APPROVED?
    │
    ▼
Allow Vendor Operation
```

For example, creating a product requires:

```text
Authenticated = YES
Role = VENDOR
Vendor Status = APPROVED
```

The approval check is performed on the **backend** so that a pending or rejected vendor cannot bypass the frontend and directly call the product API.

---

# 🏗️ High-Level Architecture

```text
                         ┌───────────────────────┐
                         │    Customer Browser   │
                         └───────────┬───────────┘
                                     │
                         ┌───────────▼───────────┐
                         │   Storefront :3000    │
                         │       Next.js         │
                         └───────────┬───────────┘
                                     │
                                     │ REST API
                                     ▼
                         ┌───────────────────────┐
                         │    Nginx API Gateway  │
                         │       :8081           │
                         └───────────┬───────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
   Auth / User Services       Product Services          Order Services
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     │
                           ┌─────────▼─────────┐
                           │  Kafka / Redis    │
                           └─────────┬─────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
          PostgreSQL              MinIO              Other Services
       Service Databases       Object Storage       Payment / Shipping
```

---

# 📂 Project Structure

```text
Ecommerce-Project/
│
├── README.md
│
├── docker-compose.yml
├── docker-compose.gateway.yml
│
├── ecommerce-backend/
│   ├── auth-service/
│   ├── admin-service/
│   ├── product-service/
│   ├── email-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── rating-service/
│   ├── inventory-service/
│   ├── invoice-service/
│   ├── analytics-service/
│   ├── vendor-service/
│   ├── search-service/
│   ├── shipping-service/
│   ├── user-service/
│   ├── refund-service/
│   ├── notification-service/
│   │
│   ├── apps/
│   └── scripts/
│
├── ecommerce-frontend/
│   ├── storefront/
│   ├── admin-dashboard/
│   └── vendor-dashboard/
│
└── nginx/
    └── nginx.conf
```

---

# 🧩 Backend Microservices

The backend is divided into independent services, each responsible for a specific business capability.

| Service                  | Responsibility                               |
| ------------------------ | -------------------------------------------- |
| **Auth Service**         | Authentication, JWT and Google OAuth         |
| **User Service**         | Customer/user management                     |
| **Admin Service**        | Administrative operations                    |
| **Product Service**      | Product catalog and product management       |
| **Cart Service**         | Shopping cart management                     |
| **Order Service**        | Order creation and order lifecycle           |
| **Payment Service**      | Payment processing                           |
| **Rating Service**       | Product reviews and ratings                  |
| **Inventory Service**    | Stock and inventory management               |
| **Invoice Service**      | Invoice generation and storage               |
| **Analytics Service**    | Ecommerce analytics and reporting            |
| **Vendor Service**       | Vendor registration, approval and management |
| **Search Service**       | Product search functionality                 |
| **Shipping Service**     | Shipping and order tracking                  |
| **Refund Service**       | Refund processing                            |
| **Email Service**        | Email notifications                          |
| **Notification Service** | Application notifications                    |

---

# 🖥️ Frontend Applications

The project contains three separate frontend applications.

## 🛍️ Storefront

Customer-facing ecommerce application built with **Next.js**.

Responsibilities include:

* Product browsing
* Product search
* Product details
* Shopping cart
* Checkout
* Payments
* Order management
* Invoice downloads
* Reviews and ratings
* Shipping tracking

**URL:**

```text
http://localhost:3000
```

---

## 🏪 Vendor Dashboard

Vendor-facing application for registration, authentication, product management, inventory, and vendor operations.

Responsibilities include:

* Vendor registration
* Vendor login
* Approval status
* Vendor dashboard
* Product creation
* Product management
* Inventory management
* Order management
* Vendor analytics

**URL:**

```text
http://localhost:5173
```

A vendor can create products **only after the admin approves the vendor account**.

---

## 👨‍💼 Admin Dashboard

Administrative application for managing the ecommerce platform.

Responsibilities include:

* Admin login
* Vendor registration management
* Vendor approval
* Vendor rejection
* User management
* Product management
* Order management
* Analytics
* Platform administration

**URL:**

```text
http://localhost:5174
```

---

# 🌐 Nginx API Gateway

Nginx acts as the centralized **API Gateway** for the backend services.

Frontend applications communicate with:

```text
http://localhost:8081/api
```

instead of directly accessing individual microservices.

Example:

```text
Frontend
   │
   ▼
http://localhost:8081/api/products
   │
   ▼
Nginx
   │
   ▼
Product Service :3003
```

The gateway provides:

* Centralized API routing
* Reverse proxying
* Authorization header forwarding
* CORS handling
* Request forwarding
* Upload size configuration
* Service health endpoints

---

# 🐳 Application Infrastructure

The application uses Docker Compose for local infrastructure components.

The main infrastructure includes:

* PostgreSQL
* Apache Kafka
* Zookeeper
* Redis
* MinIO

Docker Compose configuration:

```text
docker-compose.yml
docker-compose.gateway.yml
```

---

# 🗄️ Database Architecture

Each major microservice maintains its own PostgreSQL database.

```text
PostgreSQL
│
├── auth_db
├── admin_db
├── product_db
├── email_db
├── cart_db
├── order_db
├── payment_db
├── rating_db
├── inventory_db
├── invoice_db
├── analytics_db
├── vendor_db
├── search_db
├── shipping_db
├── user_db
├── refund_db
└── notification_db
```

This separation helps maintain service boundaries and follows the microservices principle of **database ownership by service**.

---

# 📨 Event-Driven Communication

Apache Kafka is used for asynchronous communication between microservices.

For example:

```text
Order Service
     │
     │ Order Created Event
     ▼
   Kafka
     │
     ├──────────► Inventory Service
     │
     ├──────────► Payment Service
     │
     ├──────────► Email Service
     │
     └──────────► Notification Service
```

This allows services to communicate asynchronously without creating tight dependencies between them.

---

# ⚡ Redis

Redis is used by services that require caching or temporary data storage.

Examples include:

* Cart data
* Product caching
* Session-related data
* Frequently accessed information

Default local configuration:

```text
Redis: localhost:6379
```

---

# 📦 MinIO

MinIO provides S3-compatible object storage for application files.

It is used for assets such as:

* Product images
* Generated invoices
* Other application files

Default local ports:

```text
MinIO API:     localhost:9000
MinIO Console: localhost:9001
```

---

# 🔐 Authentication

Authentication is handled through the Auth Service.

The platform supports:

* JWT-based authentication
* Google OAuth
* Role-based application access
* Authorization headers through the API Gateway

The JWT token is forwarded by Nginx to protected backend services.

### Application Roles

```text
USER
VENDOR
ADMIN
```

Vendor approval status is used in addition to the role to control vendor-specific operations.

---

# 🔄 Customer Order Flow

A typical customer order follows this flow:

```text
Customer
   │
   ▼
Storefront
   │
   ▼
Nginx API Gateway
   │
   ▼
Product Service
   │
   ▼
Cart Service
   │
   ▼
Checkout
   │
   ▼
Order Service
   │
   ├──► Payment Service
   │
   ├──► Inventory Service
   │
   ├──► Invoice Service
   │
   └──► Notification Service
```

---

# 🔄 Vendor-to-Product Flow

```text
Vendor
   │
   ▼
Vendor Dashboard :5173
   │
   ▼
Register
   │
   ▼
PENDING
   │
   ▼
Admin Dashboard :5174
   │
   ├──────────────► REJECTED
   │
   ▼
APPROVED
   │
   ▼
Vendor Login
   │
   ▼
Vendor Dashboard
   │
   ▼
Create Product
   │
   ▼
Product Service
   │
   ▼
Product Database
```

---

# 🛠️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Vite
* Tailwind CSS
* Zustand

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma
* REST APIs
* JWT
* Google OAuth

### Data & Messaging

* PostgreSQL
* Redis
* Apache Kafka
* Zookeeper

### Storage & Gateway

* MinIO
* Nginx

### External Integrations

* Razorpay
* Google OAuth
* Gmail SMTP

---

# 🚦 Application Ports

| Application / Service |   Port |
| --------------------- | -----: |
| Storefront            | `3000` |
| Vendor Dashboard      | `5173` |
| Admin Dashboard       | `5174` |
| API Gateway           | `8081` |
| Product Service       | `3003` |
| Notification Service  | `3018` |
| WebSocket             | `8080` |
| PostgreSQL            | `5432` |
| Redis                 | `6379` |
| Kafka                 | `9092` |
| MinIO API             | `9000` |
| MinIO Console         | `9001` |

---

# 🎯 Project Goals

This project demonstrates how an ecommerce application can be structured using:

* Microservices architecture
* API Gateway pattern
* Event-driven communication
* Independent service databases
* Authentication and authorization
* Vendor approval workflow
* Product management
* Shopping cart and checkout
* Order processing
* Payment processing
* Inventory management
* Object storage
* Distributed frontend applications

---

# 📌 Future Development

The application can be extended with additional features such as:

* Advanced product search
* Recommendation systems
* Improved analytics
* Real-time order updates
* Enhanced notification workflows
* Additional payment methods
* Improved vendor management
* Customer support functionality

**DevOps implementation such as CI/CD, cloud deployment, Terraform, Kubernetes, monitoring, logging, and infrastructure automation will be handled separately from this application project.**

---

# 👩‍💻 Author

**Swapna Adhav**

---

# 📄 License

This project is created for educational and portfolio purposes.

