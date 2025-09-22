#!/bin/bash

echo "🚀 FORCING BACKEND START - OVERRIDING ANY RAILWAY CONFIG"
echo "📊 Environment: NODE_ENV=$NODE_ENV"
echo "🔌 Port: PORT=$PORT"
echo "💾 Database: DB_HOST=$DB_HOST"

# Force backend start regardless of package.json
exec ts-node --project tsconfig.backend.json src/backend/simple-server.ts
