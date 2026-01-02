#!/bin/bash

# Al Sadara Deployment Script
# Run this on your VPS after uploading the project

set -e

echo "========================================="
echo "   Al Sadara Deployment Script"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo ./deploy.sh)${NC}"
  exit 1
fi

# Step 1: Install Docker if not installed
echo -e "${YELLOW}Step 1: Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
fi
echo -e "${GREEN}Docker is installed${NC}"

# Step 2: Install Docker Compose if not installed
echo -e "${YELLOW}Step 2: Checking Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi
echo -e "${GREEN}Docker Compose is installed${NC}"

# Step 3: Install Nginx if not installed
echo -e "${YELLOW}Step 3: Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
fi
echo -e "${GREEN}Nginx is installed${NC}"

# Step 4: Install Certbot for SSL
echo -e "${YELLOW}Step 4: Checking Certbot installation...${NC}"
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt-get install -y certbot python3-certbot-nginx
fi
echo -e "${GREEN}Certbot is installed${NC}"

# Step 5: Check .env file
echo -e "${YELLOW}Step 5: Checking environment file...${NC}"
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production with the following variables:"
    echo "  POSTGRES_USER=postgres"
    echo "  POSTGRES_PASSWORD=your-secure-password"
    echo "  POSTGRES_DB=alsadara"
    echo "  PAYLOAD_SECRET=your-secret-key-min-32-chars"
    exit 1
fi
echo -e "${GREEN}.env.production found${NC}"

# Step 6: Copy Nginx configuration
echo -e "${YELLOW}Step 6: Setting up Nginx...${NC}"
cp nginx.conf /etc/nginx/sites-available/alsadara.org
ln -sf /etc/nginx/sites-available/alsadara.org /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
echo -e "${GREEN}Nginx configured${NC}"

# Step 7: Get SSL Certificate
echo -e "${YELLOW}Step 7: Getting SSL certificate...${NC}"
echo "Make sure your domain (alsadara.org) is pointing to this server!"
read -p "Is your domain pointing to this server? (y/n): " domain_ready
if [ "$domain_ready" = "y" ]; then
    certbot --nginx -d alsadara.org -d www.alsadara.org --non-interactive --agree-tos --email admin@alsadara.org
    echo -e "${GREEN}SSL certificate obtained${NC}"
else
    echo -e "${YELLOW}Skipping SSL. Run 'certbot --nginx -d alsadara.org' later${NC}"
fi

# Step 8: Build and start containers
echo -e "${YELLOW}Step 8: Building and starting containers...${NC}"
cp .env.production .env
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}Containers started${NC}"

# Step 9: Restart Nginx
echo -e "${YELLOW}Step 9: Restarting Nginx...${NC}"
systemctl restart nginx
echo -e "${GREEN}Nginx restarted${NC}"

# Done!
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Your website should now be available at:"
echo "  https://alsadara.org"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Restart app: docker-compose -f docker-compose.prod.yml restart"
echo "  - Stop app: docker-compose -f docker-compose.prod.yml down"
echo ""
