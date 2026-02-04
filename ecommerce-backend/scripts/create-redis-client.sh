#!/bin/bash

# List of services
services=(
  "admin-service"
  "analytics-service"
  "cart-service"
  "auth-service"
  "email-service"
  "invoice-service"
  "order-service"
  "payment-service"
  "product-service"
  "rating-service"
  "search-service"
  "vendor-service"
)

# Loop over each service
for service in "${services[@]}"; do
  src_dir="./$service/src"
  
  # Check if src folder exists
  if [ ! -d "$src_dir" ]; then
    echo "❌ Service src folder not found: $src_dir. Skipping..."
    continue
  fi

  # Create redis folder inside src
  redis_dir="$src_dir/redis"
  if [ ! -d "$redis_dir" ]; then
    mkdir -p "$redis_dir"
    echo "📁 Created folder: $redis_dir"
  else
    echo "📁 Folder already exists: $redis_dir"
  fi

  # Create redis-client.ts only if it doesn't exist
  redis_file="$redis_dir/redis-client.ts"
  if [ ! -f "$redis_file" ]; then
    cat > "$redis_file" << 'EOF'
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl);

redis.on("connect", () => console.log(`✅ Redis connected for ${process.env.SERVICE_NAME}`));
redis.on("error", (err) => console.error("❌ Redis error:", err));
EOF
    echo "✅ Redis client created: $redis_file"
  else
    echo "⚠️ Redis client already exists: $redis_file"
  fi
done

echo "🎉 Redis setup completed for all services!"

