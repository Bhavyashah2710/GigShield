# GigShield Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Python** 3.8 or higher ([Download](https://www.python.org/))
- **Java** 11 or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven** 3.8 or higher ([Download](https://maven.apache.org/))
- **MySQL** 8.0 or higher ([Download](https://www.mysql.com/)) OR **SQLite** 3
- **Git** ([Download](https://git-scm.com/))

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GigShield-Standalone
```

### 2. Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_ENGINE_URL=http://localhost:5001
EOF

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

### 3. Setup Backend (Node.js + Express)

```bash
cd ../backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://root:password@localhost:3306/gigshield
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
AI_ENGINE_URL=http://localhost:5001
EOF

# Start the server
npm start
```

The backend API will be available at `http://localhost:5000`

### 4. Setup AI Engine (Python Flask)

```bash
cd ../ai-engine

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001
EOF

# Start the Flask server
python app.py
```

The AI Engine will be available at `http://localhost:5001`

### 5. Setup Java Utils (Optional)

```bash
cd ../java-utils

# Build with Maven
mvn clean install

# Run tests
mvn test
```

## Database Setup

### Option A: MySQL

1. **Create Database**
   ```sql
   CREATE DATABASE gigshield;
   USE gigshield;
   ```

2. **Create Tables** (Run the SQL from `docs/DATABASE_SCHEMA.md`)

3. **Update Backend .env**
   ```
   DATABASE_URL=mysql://root:password@localhost:3306/gigshield
   ```

### Option B: SQLite (Simpler for Development)

1. **Update Backend .env**
   ```
   DATABASE_URL=sqlite:./gigshield.db
   ```

2. **Backend will auto-create the database on first run**

## Configuration

### Frontend Configuration

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_ENGINE_URL=http://localhost:5001
REACT_APP_DEBUG=true
```

### Backend Configuration

Edit `backend/.env`:
```
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/gigshield
JWT_SECRET=your_secret_key_here
AI_ENGINE_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
```

### AI Engine Configuration

Edit `ai-engine/.env`:
```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001
OPENWEATHER_API_KEY=your_api_key_here
WAQI_API_KEY=your_api_key_here
```

## Running All Services

### Option 1: Terminal Windows (Recommended for Development)

Open 3 separate terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - AI Engine:**
```bash
cd ai-engine
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

### Option 2: Using Docker (Optional)

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
      - REACT_APP_AI_ENGINE_URL=http://localhost:5001

  backend:
    build:
      context: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DATABASE_URL=mysql://root:password@db:3306/gigshield
      - JWT_SECRET=your_secret_key
      - AI_ENGINE_URL=http://ai-engine:5001
    depends_on:
      - db
      - ai-engine

  ai-engine:
    build:
      context: ./ai-engine
    ports:
      - "5001:5001"
    environment:
      - FLASK_ENV=production
      - PORT=5001

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=gigshield
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Then run:
```bash
docker-compose up
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### AI Engine Tests
```bash
cd ai-engine
pytest
```

## Troubleshooting

### Port Already in Use

If you get "Port already in use" error:

**Find and kill the process:**
```bash
# On Linux/Mac
lsof -i :3000  # Replace 3000 with the port number
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

1. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```

2. Check DATABASE_URL in `.env` is correct

3. Ensure database exists:
   ```sql
   CREATE DATABASE gigshield;
   ```

### Python Virtual Environment Issues

```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node Modules Issues

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Accessing the Application

Once all services are running:

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000
3. **AI Engine**: http://localhost:5001

### Test Credentials

Use these credentials to test the application:

**Email:** rajan@example.com  
**Password:** password

## Next Steps

1. Review the [API Documentation](./API_DOCUMENTATION.md)
2. Check the [Database Schema](./DATABASE_SCHEMA.md)
3. Read the [Architecture Guide](./ARCHITECTURE.md)
4. Explore the code and start developing!

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing GitHub issues
3. Create a new issue with detailed information
4. Contact the development team

## Production Deployment

For deploying to production:

1. Update all `.env` files with production values
2. Set `NODE_ENV=production` in backend
3. Set `FLASK_ENV=production` in AI engine
4. Use a production database (not SQLite)
5. Set up SSL/HTTPS certificates
6. Configure proper CORS settings
7. Use environment variables for sensitive data
8. Deploy to cloud platform (AWS, Heroku, DigitalOcean, etc.)

See deployment guides in the `docs/` directory for specific platforms.
