#!/bin/bash
set -e

echo "🚀 Starting ecommerce backend setup..."

# -------------------------------------------------
# Move to project root (VERY IMPORTANT)
# -------------------------------------------------
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "📁 Project root: $ROOT_DIR"

# -------------------------------------------------
# Database config
# -------------------------------------------------
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"

# -------------------------------------------------
# Databases per service
# -------------------------------------------------
DATABASES=(
  user_db
  vendor_db
  admin_db
  product_db
  order_db
  payment_db
  invoice_db
  rating_review_db
  analytics_db
  shipping_db
)

echo "🗄️ Creating databases..."

for db in "${DATABASES[@]}"; do
  PGPASSWORD=$POSTGRES_PASSWORD psql \
    -h $POSTGRES_HOST \
    -p $POSTGRES_PORT \
    -U $POSTGRES_USER \
    -tc "SELECT 1 FROM pg_database WHERE datname = '$db'" \
  | grep -q 1 || \
  PGPASSWORD=$POSTGRES_PASSWORD psql \
    -h $POSTGRES_HOST \
    -p $POSTGRES_PORT \
    -U $POSTGRES_USER \
    -c "CREATE DATABASE $db;"

  echo "✅ Database ready: $db"
done

# -------------------------------------------------
# Services using Prisma
# -------------------------------------------------
PRISMA_SERVICES=(
  user-service
  vendor-service
  admin-service
  product-service
  order-service
  payment-service
  invoice-service
  rating-review-service
  analytics-service
  shipping-service
)

echo ""
echo "📦 Running Prisma setup..."

for service in "${PRISMA_SERVICES[@]}"; do
  SERVICE_PATH="$ROOT_DIR/$service"

  echo ""
  echo "🔧 Setting up $service"

  if [ -d "$SERVICE_PATH" ]; then
    cd "$SERVICE_PATH"

    if [ -f "prisma/schema.prisma" ]; then
      echo "📄 Prisma schema found"
      npx prisma generate
      npx prisma migrate deploy
      echo "✅ Prisma ready for $service"
    else
      echo "⚠️ No prisma/schema.prisma in $service"
    fi
  else
    echo "❌ Service folder not found: $service"
  fi
done

echo ""
echo "🎉 Ecommerce backend setup completed successfully!"
