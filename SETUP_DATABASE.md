# 🗄️ Ghid de Configurare Baza de Date - CyberTest

Acest ghid explică cum să configurezi baza de date MySQL locală pentru proiectul CyberTest.

## 📋 Cerințe Preliminare

### 1. Instalare MySQL
- **Windows:** Descarcă MySQL Community Server de pe [mysql.com](https://dev.mysql.com/downloads/mysql/)
- **macOS:** `brew install mysql` sau descarcă de pe site-ul oficial
- **Linux:** `sudo apt-get install mysql-server` (Ubuntu/Debian) sau `sudo yum install mysql-server` (CentOS/RHEL)

### 2. Pornire MySQL Server
```bash
# Windows (ca serviciu)
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
sudo systemctl enable mysql
```

## ⚙️ Configurare Proiect

### 1. Clonează Repository-ul
```bash
git clone https://github.com/piatadesiteuri/CyberTest.git
cd CyberTest
git checkout develop
```

### 2. Instalează Dependențele
```bash
npm install
```

### 3. Configurează Variabilele de Mediu
Creează fișierul `.env` în root-ul proiectului:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cyber

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3001
BCRYPT_ROUNDS=12
```

**⚠️ Important:** Înlocuiește `your_mysql_password` cu parola ta MySQL reală!

## 🗄️ Creare Baza de Date

### Opțiunea 1: Script Automat (Recomandat)
```bash
npm run db:create
```

Acest script va:
- ✅ Conecta la MySQL server
- ✅ Crea baza de date `cyber`
- ✅ Crea toate tabelele necesare:
  - `users` - utilizatori și roluri
  - `refresh_tokens` - token-uri de refresh
  - `password_reset_tokens` - token-uri de resetare parolă
  - `email_verification_tokens` - token-uri de verificare email

### Opțiunea 2: Manual (Dacă scriptul nu funcționează)
Conectează-te la MySQL și rulează:

```sql
-- Creează baza de date
CREATE DATABASE IF NOT EXISTS cyber;
USE cyber;

-- Creează tabelul users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role ENUM('employee', 'manager', 'admin', 'it_security_admin', 'ciso') NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_department (department),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creează tabelul refresh_tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_revoked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creează tabelul password_reset_tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creează tabelul email_verification_tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 👤 Creare Utilizator Admin

După ce ai creat baza de date, creează un utilizator admin:

```bash
npm run db:create-admin
```

Acest script va crea un utilizator admin cu:
- **Email:** `admin@cybertest.com`
- **Parolă:** `admin123`
- **Rol:** `admin`

## 🚀 Pornire Aplicație

### 1. Pornește Aplicația Completă
```bash
npm run dev
```

Aceasta va porni:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

### 2. Pornește Doar Frontend
```bash
npm run frontend
```

### 3. Pornește Doar Backend
```bash
npm run backend:simple
```

## 🔧 Scripturi Disponibile

| Script | Descriere |
|--------|-----------|
| `npm run db:create` | Creează baza de date și toate tabelele |
| `npm run db:reset` | Resetează baza de date (același ca create) |
| `npm run db:create-admin` | Creează utilizator admin |
| `npm run dev` | Pornește aplicația completă |
| `npm run frontend` | Pornește doar frontend-ul |
| `npm run backend:simple` | Pornește doar backend-ul |

## 🐛 Rezolvare Probleme

### Eroare de Conectare la MySQL
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Soluție:** Asigură-te că MySQL server rulează și că parola din `.env` este corectă.

### Eroare de Permisiuni
```
Error: Access denied for user 'root'@'localhost'
```
**Soluție:** Verifică că utilizatorul `root` are parola corectă sau creează un utilizator nou:
```sql
CREATE USER 'cybertest'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cyber.* TO 'cybertest'@'localhost';
FLUSH PRIVILEGES;
```

### Eroare de Bază de Date
```
Error: Unknown database 'cyber'
```
**Soluție:** Rulează `npm run db:create` pentru a crea baza de date.

## 📊 Verificare Configurare

### 1. Verifică Conectarea la MySQL
```bash
mysql -u root -p
SHOW DATABASES;
USE cyber;
SHOW TABLES;
```

### 2. Verifică Utilizatorii
```sql
SELECT * FROM cyber.users;
```

### 3. Testează Aplicația
- Deschide http://localhost:3000
- Încearcă să te loghezi cu `admin@cybertest.com` / `admin123`

## 🎉 Gata!

Acum ai o configurare completă a bazei de date pentru CyberTest! Poți începe să dezvolți sau să testezi aplicația.

**Următorii pași:**
1. Creează-ți propriul branch: `git checkout -b your-feature-branch`
2. Începe dezvoltarea!
3. Când ești gata, fă un Pull Request către `develop`
