export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'cyber',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  connectionLimit: 10,
  timeout: 60000
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as string
}

export const serverConfig = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}

export const bcryptConfig = {
  rounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
}
