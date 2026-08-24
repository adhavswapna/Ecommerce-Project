# 🛒 ShopSphere — Microservices E-Commerce Platform

ShopSphere is a full-stack e-commerce application built using a **microservices architecture**.

The project separates authentication, users, products, carts, orders, payments, vendors, administration, inventory, shipping, invoices, notifications, and other business functions into independent services, This project is designed as a scalable e-commerce application with independently developed backend services responsible for different business domains such as authentication, users, products, carts, orders, payments, inventory, invoices, shipping, refunds, and notifications.The frontend provides separate interfaces for customers, administrators, and vendors.
---

# 📌 Architecture Overview


                         ┌──────────────────────┐
                         │      Customer        │
                         │      Browser         │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌──────────────────────┐
                         │   Next.js Frontend   │
                         │      Port 3000       │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │    NGINX API         │
                         │      Gateway         │
                         │      Port 8081       │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        Auth Service          Product Service        Cart Service
          :3001                  :3003                  :3005
              │                     │                     │
              │                     │                     │
              ▼                     ▼                     ▼
          PostgreSQL           PostgreSQL              PostgreSQL


                 ┌─────────────────────────────────┐
                 │          Other Services          │
                 ├─────────────────────────────────┤
                 │ User Service        :3015        │
                 │ Order Service       :3006        │
                 │ Payment Service     :3007        │
                 │ Rating Service      :3008        │
                 │ Inventory Service   :3009        │
                 │ Invoice Service     :3010        │
                 │ Analytics Service   :3011        │
                 │ Vendor Service      :3012        │
                 │ Search Service      :3013        │
                 │ Shipping Service    :3014        │
                 │ Refund Service      :3016        │
                 │ Notification        :3018        │
                 │ Email Service       :3004        │
                 │ Admin Service       :3002        │
                 └─────────────────────────────────┘

                         ┌──────────────────┐
                         │      Kafka       │
                         │     :9092        │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Auth Events         Vendor Events       Admin Events
        Order Events        Payment Events      Notification Events


                         ┌──────────────────┐
                         │      Redis       │
                         │      Cache       │
                         └──────────────────┘


                         ┌──────────────────┐
                         │      MinIO       │
                         │ Product Images   │
                         │   :9000 / :9001  │
                         └──────────────────┘


🛠️ Technology Stack
Frontend
Next.js
TypeScript
Zustand
WebSockets
Backend
Node.js
Express.js
TypeScript
Prisma ORM
REST APIs
Microservices Architecture
Database & Infrastructure Services
PostgreSQL
Redis
Apache Kafka
MinIO
API Gateway
Nginx
✨ Features
👤 Authentication & Users
User registration and login
JWT authentication
Google OAuth
Role-based access control
User management
🛍️ Products
Product creation and management
Product browsing
Product images
Product inventory information
Vendor product management
🛒 Shopping
Shopping cart
Cart item management
Product ordering
Order tracking
💳 Orders & Payments
Order processing
Payment processing
Payment status management
Order lifecycle management
📦 Inventory & Shipping
Inventory management
Stock tracking
Shipping management
Order shipment processing
🧾 Invoices & Refunds
Invoice generation
Invoice download
Refund processing
🔔 Notifications
Event-based notifications
Real-time communication using WebSockets
Asynchronous communication using Kafka
🧩 Microservices
The backend is divided into multiple independent services, including:
Auth Service
User Service
Product Service
Cart Service
Order Service
Payment Service
Inventory Service
Invoice Service
Shipping Service
Refund Service
Notification Service
And other supporting services
Each service has its own responsibility and communicates with other services through defined APIs and events.

📁 Project Structure
Ecommerce-Project/
│
├── ecommerce-frontend/
│   ├── storefront/
│   ├── admin-dashboard/
│   └── vendor-dashboard/
│
└── ecommerce-backend/
    ├── auth-service/
    ├── user-service/
    ├── product-service/
    ├── cart-service/
    ├── order-service/
    ├── payment-service/
    ├── inventory-service/
    ├── invoice-service/
    ├── shipping-service/
    ├── refund-service/
    ├── notification-service/
    └── ...
🎯 Project Objective
The goal of this project is to build a modular, scalable e-commerce platform using modern full-stack technologies and a microservices architecture.The architecture allows individual services to be developed, maintained, and scaled independently while supporting communication between services through APIs and event-driven messaging.



📦 Microservices
Service	Port	Responsibility
Auth Service	3001	Authentication, login, registration
Admin Service	3002	Admin operations
Product Service	3003	Product management
Email Service	3004	Email processing
Cart Service	3005	Cart and wishlist
Order Service	3006	Orders
Payment Service	3007	Payments
Rating Service	3008	Product ratings
Inventory Service	3009	Stock management
Invoice Service	3010	Invoice generation
Analytics Service	3011	Analytics
Vendor Service	3012	Vendor management
Search Service	3013	Product search
Shipping Service	3014	Shipping
User Service	3015	User profiles
Refund Service	3016	Refund processing
Notification Service	3018	Notifications
🔐 Authentication Architecture

The Auth Service is responsible for:

User registration
User login
Vendor authentication
Admin authentication
JWT generation
Google OAuth
Password reset
User profile
Role-based access control

Supported roles:

USER
VENDOR
ADMIN

The authentication database contains:

AuthUser

with:

id
name
email
password
role
phone
address
isVerified
resetToken
resetTokenExpiry
createdAt
updatedAt
👤 User Registration Flow

A normal customer registers through:

POST /api/auth/register

Example:

{
  "name": "Swapna Adhav",
  "email": "user@example.com",
  "password": "Password123",
  "phone": "9999999999",
  "address": "Mumbai"
}

The Auth Service:

Validates the request.
Hashes the password.
Creates the user in PostgreSQL.
Assigns:
role = USER
Generates a JWT.
Publishes a user-created Kafka event.
🏪 Vendor Creation Architecture

Vendor creation is different from normal customer registration.

The recommended real-world flow is:

Admin Dashboard
       │
       │ Create Vendor
       ▼
Admin/Auth Layer
       │
       │ Create AuthUser
       │ role = VENDOR
       ▼
Auth Service
       │
       │ Kafka user.created
       ▼
Vendor Service
       │
       ▼
Vendor Database

The vendor creation form contains:

Name
Email
Password
Phone
Address

There is no need for the admin to enter User ID manually.

The Auth Service automatically generates the user ID.

Example:

Admin enters:


Name: Swapna Adhav
Email: swapnaadhav123@gmail.com
Password: Vendor Password
Phone: 09167455961
Address: Flat 204, 2nd Flr...

Auth Service creates:

AuthUser
----------------------------
id       → automatically generated
name     → Swapna Adhav
email    → swapnaadhav123@gmail.com
password → hashed password
role     → VENDOR

The generated id becomes the vendor's userId.

🔑 Vendor Login

After the vendor is created, the vendor can log in normally.

Vendor
   │
   │ Email + Password
   ▼
Auth Service
   │
   │ Verify password
   ▼
JWT
   │
   ▼
Vendor Dashboard

The vendor does not need to know their UUID/User ID.

The vendor uses:

Email
Password
👨‍💼 Admin Architecture

Admin is responsible for managing the platform.

Typical admin operations include:

Manage Vendors
Manage Users
Manage Products
Approve Vendors
Reject Vendors
Ban Users
View Orders
View Payments
View Inventory
View Analytics
Manage Refunds

Admin authentication should be handled by the Auth Service using:

role = ADMIN

The Admin Service handles admin-specific business operations/events.

🏪 Vendor Approval Lifecycle

The Vendor Service contains:

VendorStatus

with:

PENDING
APPROVED
REJECTED

Recommended lifecycle:

Vendor Created
      │
      ▼
   PENDING
      │
      ├───────────────┐
      │               │
      ▼               ▼
  APPROVED         REJECTED
      │
      ▼
Vendor can operate

The Vendor model contains:

Vendor
-------------------
id
name
email
phone
address
userId
status
isActive
createdAt
updatedAt
🔄 Vendor Creation Example

Admin dashboard:

Create Vendor


Name:
Swapna Adhav


Email:
swapnaadhav123@gmail.com


Password:
Vendor Password


Phone:
09167455961


Address:
Flat 204, 2nd Flr, Shantiniketan CHS,
Sector 8 Plot 8, Kharghar


[Create Vendor]

The frontend sends:

{
  "name": "Swapna Adhav",
  "email": "swapnaadhav123@gmail.com",
  "password": "Vendor Password",
  "phone": "09167455961",
  "address": "Flat 204, 2nd Flr..."
}

The frontend does not send:

userId

The backend creates the AuthUser and generates the ID automatically.

📡 Kafka Architecture

Kafka is used for asynchronous communication between microservices.

Example:

Auth Service
     │
     │ user.created
     ▼
   Kafka
     │
     ├──────────────► User Service
     │
     └──────────────► Vendor Service

Other examples:

Order Created
     │
     ▼
   Kafka
     │
     ├──► Inventory
     ├──► Payment
     ├──► Notification
     └──► Analytics

Vendor events:

vendor.created
vendor.status.updated

Admin events:

admin.created
user.banned
system.alert
⚡ Redis

Redis is used for fast temporary data and session management.

Example:

session:<sessionId>

Sessions can expire automatically.

Current authentication session configuration:

7 days

Redis can also be extended for:

API caching
Product caching
Rate limiting
Session storage
Temporary tokens
🗄️ Database Architecture

Each microservice should ideally own its own database/schema.

Example:

Auth Service
    │
    └── auth_db


Product Service
    │
    └── product_db


Cart Service
    │
    └── cart_db


Order Service
    │
    └── order_db


Vendor Service
    │
    └── vendor_db


Payment Service
    │
    └── payment_db

This follows the microservice principle:

Each service owns its own data.

Services communicate using:

REST APIs
Kafka Events

rather than directly accessing another service's database.

🖼️ MinIO

MinIO is used for object storage.

Product images are stored in MinIO.

Frontend
    │
    ▼
Product Service
    │
    ▼
MinIO

MinIO ports:

9000 → API
9001 → Console
🌐 NGINX API Gateway

The frontend does not need to directly communicate with every microservice.

Instead:

Next.js
   │
   ▼
NGINX
:8081
   │
   ├── /api/auth     → Auth Service
   ├── /api/products → Product Service
   ├── /api/cart     → Cart Service
   ├── /api/orders   → Order Service
   ├── /api/vendors  → Vendor Service
   ├── /api/payment  → Payment Service
   └── ...

This provides a single API entry point.

Frontend configuration:

NEXT_PUBLIC_API_URL=http://localhost:8081/api
🔒 Role-Based Access Control

The system supports:

USER
VENDOR
ADMIN

Example:

USER
 └── Shopping


VENDOR
 ├── Manage products
 ├── View vendor orders
 └── Manage inventory


ADMIN
 ├── Manage users
 ├── Manage vendors
 ├── Approve vendors
 ├── Manage products
 └── Platform administration

JWT contains information such as:

{
  "userId": "uuid",
  "role": "VENDOR",
  "name": "Swapna Adhav",
  "email": "swapnaadhav123@gmail.com"
}

The middleware checks the role before allowing protected operations.

🔐 Password Security

Passwords are never stored as plain text.

Example:

User enters:


MyPassword123

Auth Service:

MyPassword123
       │
       ▼
    bcrypt
       │
       ▼
hashed password
       │
       ▼
PostgreSQL

During login:

Entered password
       │
       ▼
bcrypt.compare()
       │
       ▼
Valid / Invalid
🔄 Password Reset

The password reset flow is:

User
 │
 │ Forgot Password
 ▼
Auth Service
 │
 │ Generate secure token
 ▼
PostgreSQL
 │
 │ Hashed token
 ▼
Kafka
 │
 ▼
Email Service
 │
 ▼
User Email

Reset tokens expire after:

15 minutes
🌐 Google OAuth

Google authentication is supported.

Flow:

User
 │
 ▼
Google Login
 │
 ▼
Google OAuth
 │
 ▼
Auth Service
 │
 ▼
Find/Create AuthUser
 │
 ▼
JWT
 │
 ▼
Frontend

Google users are automatically created with:

role = USER
🛍️ Typical E-Commerce Order Flow

A complete order can work like:

Customer
   │
   ▼
Frontend
   │
   ▼
API Gateway
   │
   ▼
Cart Service
   │
   ▼
Order Service
   │
   ├──────────► Payment Service
   │
   ├──────────► Inventory Service
   │
   ├──────────► Invoice Service
   │
   ├──────────► Shipping Service
   │
   └──────────► Notification Service
                    │
                    ▼
                Email Service

Kafka can be used for asynchronous events between these services.

📊 Analytics Flow

Business events can be sent to Kafka:

Order Created
Payment Completed
Product Viewed
Product Purchased
Vendor Created
Refund Created

Kafka:

             Kafka
               │
               ▼
       Analytics Service
               │
               ▼
        Analytics Database

This allows analytics processing without slowing down the main transaction.

🐳 Docker Architecture

Infrastructure runs using Docker.

Typical containers include:

PostgreSQL
Redis
Kafka
Zookeeper / Kafka dependencies
MinIO

Microservices can also be containerized individually.

Example:

Docker
 ├── auth-service
 ├── user-service
 ├── product-service
 ├── cart-service
 ├── order-service
 ├── payment-service
 ├── vendor-service
 ├── admin-service
 ├── kafka
 ├── redis
 ├── postgres
 └── minio
🚀 Local Development
Start infrastructure

Start Docker services:

docker compose up -d

Check running containers:

docker ps
▶️ Start Backend Services

Each service can be started separately.

Example:

cd auth-service
npm install
npm run dev

Vendor service:

cd vendor-service
npm install
npm run dev

Admin service:

cd admin-service
npm install
npm run dev
▶️ Start Frontend
cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000

API Gateway:

http://localhost:8081
🧪 Health Checks

Services should expose health endpoints.

Example:

GET /health

Admin:

GET /admin/health

Expected response:

{
  "status": "Admin service is healthy"
}
📁 Important Project Structure
Ecommerce-Project/
│
├── frontend/
│
├── ecommerce-backend/
│   │
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middlewares/
│   │   │   ├── kafka/
│   │   │   ├── db/
│   │   │   └── utils/
│   │
│   ├── admin-service/
│   ├── vendor-service/
│   ├── user-service/
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   ├── invoice-service/
│   ├── shipping-service/
│   ├── refund-service/
│   ├── notification-service/
│   ├── email-service/
│   ├── search-service/
│   ├── rating-service/
│   └── analytics-service/
│
├── nginx/
│
├── docker-compose.yml
│
└── README.md
🧩 Important Design Principle

The most important distinction is:

Auth Service
     │
     │ Identity
     ▼
Who is this user?

while:

Vendor Service
     │
     │ Business information
     ▼
What vendor information does this user have?

For example:

AuthUser
-------------------------
id: 123
name: Swapna Adhav
email: swapnaadhav123@gmail.com
role: VENDOR
password: hashed

Vendor:

Vendor
-------------------------
id: 456
userId: 123
name: Swapna Adhav
email: swapnaadhav123@gmail.com
status: PENDING
isActive: true

The userId connects the vendor business record to the authentication identity.

The admin should not manually type this ID.

🔁 Recommended Vendor Creation Flow
                 ADMIN DASHBOARD
                       │
                       │
              Create Vendor Form
                       │
                       │
             Name / Email / Password
             Phone / Address
                       │
                       ▼
                 API Gateway
                       │
                       ▼
                 Auth Service
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       Create AuthUser       Generate UUID
             │
             │ role = VENDOR
             ▼
           Kafka
             │
             │ user.created
             ▼
       Vendor Service
             │
             ▼
       Create Vendor
             │
             ▼
          PENDING
             │
             ▼
       Admin Approval
             │
       ┌─────┴─────┐
       ▼           ▼
   APPROVED     REJECTED
       │
       ▼


 Vendor can use


 Vendor Dashboard
☁️ DevOps Architecture

The project can be deployed using:

GitHub
   │
   ▼
CI/CD Pipeline
   │
   ├── Build
   ├── Test
   ├── Docker Build
   ├── Push Image
   └── Deploy
           │
           ▼
        AWS
           │
           ├── EC2 / EKS
           ├── RDS
           ├── S3
           └── Load Balancer

Infrastructure can be managed using:

Terraform

Configuration management:

Ansible

Container orchestration:

Kubernetes


🧱 DevOps Concepts Demonstrated

This project demonstrates:

Microservices
REST APIs
API Gateway
Docker
PostgreSQL
Prisma
Redis
Kafka
Event-driven architecture
JWT authentication
OAuth
RBAC
Object storage
NGINX
CI/CD
Infrastructure as Code
Terraform
Kubernetes
AWS
Monitoring and logging concepts
🔮 Future Improvements

Recommended improvements include:

Centralized authentication between services
JWT validation at API Gateway
Vendor approval authorization
Kafka retry handling
Dead Letter Queue
API rate limiting
Centralized logging
Prometheus
Grafana
Distributed tracing
Docker image optimization
Kubernetes deployment
Terraform AWS infrastructure
CI/CD with GitHub Actions
Secrets management
Automated testing

🎯 Project Goal

ShopSphere demonstrates how a modern e-commerce application can be designed using independently deployable microservices.

The project combines:

Frontend
   +
Microservices
   +
API Gateway
   +
PostgreSQL
   +
Redis
   +
Kafka
   +
MinIO
   +
Docker
   +
AWS
   +
Terraform
   +
Kubernetes
   +
CI/CD

This architecture is intended to provide practical experience with modern backend engineering and DevOps practices.

👩‍💻 Author

Swapna Adhav

DevOps / Cloud Computing Enthusiast

Technologies:

AWS
Docker
Kubernetes
Terraform
Ansible
Git
GitHub
CI/CD
Linux
Node.js
Microservices
Kafka
Redis
PostgreSQL
