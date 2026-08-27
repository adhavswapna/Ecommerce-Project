# 🛒 Ecommerce Microservices Platform

A scalable **microservices-based ecommerce platform** designed to simulate a production-style online shopping ecosystem.

The project is structured into independent backend services, dedicated frontend applications, centralized API Gateway routing, and containerized infrastructure. Each major business capability is implemented as an independent microservice, allowing services to be developed, deployed, scaled, and maintained independently.

---

## 🚀 Project Overview

The platform provides separate interfaces for three types of users:

* 🛍️ **Customers** — Browse products, manage carts, place orders, make payments, track shipments, download invoices, and manage reviews.
* 🏪 **Vendors** — Manage products, inventory, orders, and vendor-related operations.
* 👨‍💼 **Administrators** — Manage users, vendors, products, orders, analytics, and platform operations.

The backend follows a **microservices architecture**, where individual business capabilities are separated into independent services.

Communication between services is supported through **REST APIs** and **Apache Kafka** for event-driven asynchronous communication.

---

## 🏗️ High-Level Architecture

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
       Service Databases       Object Storage        Payment / Shipping
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

| Service                  | Responsibility                         |
| ------------------------ | -------------------------------------- |
| **Auth Service**         | Authentication, JWT and Google OAuth   |
| **User Service**         | Customer/user management               |
| **Admin Service**        | Administrative operations              |
| **Product Service**      | Product catalog and product management |
| **Cart Service**         | Shopping cart management               |
| **Order Service**        | Order creation and order lifecycle     |
| **Payment Service**      | Payment processing                     |
| **Rating Service**       | Product reviews and ratings            |
| **Inventory Service**    | Stock and inventory management         |
| **Invoice Service**      | Invoice generation and storage         |
| **Analytics Service**    | Ecommerce analytics and reporting      |
| **Vendor Service**       | Vendor management                      |
| **Search Service**       | Product search functionality           |
| **Shipping Service**     | Shipping and order tracking            |
| **Refund Service**       | Refund processing                      |
| **Email Service**        | Email notifications                    |
| **Notification Service** | Application notifications              |

---

# 🖥️ Frontend Applications

The project contains three separate frontend applications.

### 🛍️ Storefront

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

---

### 🏪 Vendor Dashboard

Dedicated dashboard for vendors.

Responsibilities include:

* Vendor authentication
* Product management
* Inventory management
* Order management
* Vendor analytics
* Vendor-related operations

---

### 👨‍💼 Admin Dashboard

Administrative interface for managing the ecommerce platform.

Responsibilities include:

* User management
* Vendor management
* Product management
* Order management
* Analytics
* Platform administration

---

# 🌐 Nginx API Gateway

Nginx acts as the centralized **API Gateway** for the backend services.

The frontend communicates with:

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

# 🐳 Containerized Infrastructure

The project uses Docker Compose to manage infrastructure components.

The main infrastructure includes:

* PostgreSQL
* Apache Kafka
* Zookeeper
* Redis
* MinIO

Docker Compose configuration is provided through:

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

---

# 🔄 Request Flow

A typical customer request follows this architecture:

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
Required Microservice
   │
   ├── PostgreSQL
   ├── Redis
   ├── Kafka
   └── MinIO
```

This architecture provides a single API entry point while keeping backend business logic distributed across independent services.

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

### Infrastructure

* Docker
* Docker Compose
* Nginx
* PostgreSQL
* Redis
* Apache Kafka
* Zookeeper
* MinIO

### External Integrations

* Razorpay
* Google OAuth
* Gmail SMTP

---

# 🎯 Project Goals

This project demonstrates how a modern ecommerce platform can be structured using:

* Microservices architecture
* API Gateway pattern
* Event-driven communication
* Containerized infrastructure
* Independent service databases
* Authentication and authorization
* Object storage
* Distributed frontend applications

The architecture is also suitable as a foundation for further **DevOps implementation**, including CI/CD pipelines, infrastructure automation, container orchestration, monitoring, logging, security, and cloud deployment.

