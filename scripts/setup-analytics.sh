#!/bin/bash

echo "🚀 Setting up local Plausible Analytics..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create a random secret key
SECRET_KEY=$(openssl rand -base64 64 | tr -d '\n')

# Update the secret key in the env file
sed -i "s/your-secret-key-base-change-this-to-a-random-64-character-string-in-production/$SECRET_KEY/" .env.plausible

echo "📁 Starting Plausible Analytics containers..."

# Start the analytics stack
docker-compose -f docker-compose.analytics.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "👤 Creating admin user for Plausible..."

# Create admin user (you'll need to change these credentials)
docker-compose -f docker-compose.analytics.yml exec plausible /entrypoint.sh db createdb
docker-compose -f docker-compose.analytics.yml exec plausible /entrypoint.sh db migrate
docker-compose -f docker-compose.analytics.yml exec plausible /entrypoint.sh db seed

echo "🌐 Adding site to Plausible..."

# The site needs to be added manually via the web interface
echo "📋 Next steps:"
echo "1. Open http://localhost:8000 in your browser"
echo "2. Create an admin account"
echo "3. Add 'localhost:3000' as a site"
echo "4. Copy the site's API key and add it to your .env file as PLAUSIBLE_API_KEY="
echo ""
echo "✅ Plausible Analytics is now running at http://localhost:8000"
echo "🔧 Your Nuxt app will automatically track events to this local instance"