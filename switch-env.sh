#!/bin/bash

# Script to switch between local and Railway environment

if [ "$1" = "local" ]; then
    echo "🔄 Switching to LOCAL development environment..."
    cp .env.backup .env.railway
    sed -i '' 's/NODE_ENV=production/NODE_ENV=development/' .env
    sed -i '' 's/DB_HOST=mysql.railway.internal/DB_HOST=localhost/' .env
    sed -i '' 's/DB_NAME=railway/DB_NAME=cyber/' .env
    sed -i '' 's/DB_PASSWORD=wMrjXNAzIvUAEPCPfRnabhPTFGYZtxXX/DB_PASSWORD=/' .env
    echo "✅ Switched to LOCAL environment"
    echo "   - NODE_ENV: development"
    echo "   - DB_HOST: localhost"
    echo "   - DB_NAME: cyber"
elif [ "$1" = "railway" ]; then
    echo "🔄 Switching to RAILWAY production environment..."
    cp .env.backup .env
    echo "✅ Switched to RAILWAY environment"
    echo "   - NODE_ENV: production"
    echo "   - DB_HOST: mysql.railway.internal"
    echo "   - DB_NAME: railway"
else
    echo "Usage: ./switch-env.sh [local|railway]"
    echo "  local   - Switch to local development environment"
    echo "  railway - Switch to Railway production environment"
fi
