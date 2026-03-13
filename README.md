# ShopSphere - E-Commerce Project

This is a microservices-based e-commerce platform with **backend services** using Node.js, Express, Kafka, PostgreSQL, and a **frontend** built with Next.js.

---

## 📂 Project Structure


Ecommerce-Project/
├─ ecommerce-backend/
│ ├─ auth-service/
│ ├─ admin-service/
│ ├─ product-service/
│ ├─ ... other services
│ └─ docker-compose.yml
├─ ecommerce-frontend/
│ ├─ storefront/ # User-facing frontend
│ ├─ vendor-dashboard/ # Vendor dashboard (future)
│ └─ admin-dashboard/ # Admin dashboard (future)
└─ README.md


---

## ⚡ Prerequisites

Make sure you have the following installed on **WSL (Ubuntu)**:

1. **Node.js & npm**  
```bash
# Check versions
node -v
npm -v

If not installed, run:

sudo apt update
sudo apt install curl -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

Docker & Docker Compose

Install Docker Desktop on Windows

Enable WSL integration for your distro

Check:

docker --version
docker compose version

Optional: Install pnpm if you prefer (not required):

npm install -g pnpm
🛠 Backend Setup (auth-service example)
1. Install dependencies
cd ecommerce-backend/auth-service
npm install
2. Create .env file
# Auth & User Services
NEXT_PUBLIC_AUTH_API_URL=http://127.0.0.1:3001
NEXT_PUBLIC_USER_API_URL=http://127.0.0.1:3015
NEXT_PUBLIC_ADMIN_API_URL=http://127.0.0.1:3002

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/shopdb

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:3001/auth/google/callback

# Kafka
ENABLE_KAFKA=true
KAFKA_BROKER=localhost:9092
SERVICE_NAME=auth-service

Adjust credentials according to your environment.

3. Run service
npm run dev

Auth service will start on http://127.0.0.1:3001

Health check: http://127.0.0.1:3001/health

🐳 Running all services via Docker Compose

From project root:

cd Ecommerce-Project
docker compose up -d

This will start all backend services, Kafka, Postgres, Redis, etc.

Verify running containers:

docker ps
🛍 Frontend Setup (Storefront)
1. Install dependencies
cd ecommerce-frontend/storefront
npm install
2. Create .env.local file
NEXT_PUBLIC_AUTH_API_URL=http://127.0.0.1:3001
NEXT_PUBLIC_USER_API_URL=http://127.0.0.1:3015
NEXT_PUBLIC_ADMIN_API_URL=http://127.0.0.1:3002
3. Run frontend
npm run dev

Open http://localhost:3000/login
 to test login

Open http://localhost:3000/register
 to test registration

🔑 Test Auth Flow

Register a user via frontend /register page or Postman.

Login via /login.

Check Navbar updates with logout button after login.

Forgot Password / Reset Password

Use /forgot-password → backend prints reset token in console.

Use /reset-password → enter new password.

Google Login

Click “Continue with Google” → will redirect to Google OAuth → token returned.

⚙ Useful Commands
Command	Description
npm install	Install dependencies
npm run dev	Start service in development
docker compose up -d	Start all services via Docker Compose
docker ps	Check running containers
docker compose logs -f	View logs
⚡ Notes

Make sure backend is running before testing frontend.

Store JWT token in localStorage via auth.store.ts.

WSL users may need to add user to docker group for Docker commands without sudo:

sudo usermod -aG docker $USER
newgrp docker

This README will let anyone set up backend + frontend for the first time and test auth flow.
