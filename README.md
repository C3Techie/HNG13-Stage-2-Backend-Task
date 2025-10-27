# Country Currency & Exchange API

A RESTful API that fetches country data from external APIs, stores it in a MySQL database, and provides CRUD operations with currency exchange rate calculations.

## 🚀 Features

- Fetch country data from RestCountries API
- Fetch exchange rates from Exchange Rate API
- Calculate estimated GDP for each country
- Store and cache data in MySQL database
- Filter countries by region and currency
- Sort countries by various fields (GDP, population, name)
- Generate summary images with top countries
- Full CRUD operations

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd HNG13-Stage-2-Backend-Task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a MySQL database for the project:

```sql
CREATE DATABASE countries_db;
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=countries_db

# API Configuration
COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD
```

**Important:** Update `DB_USERNAME` and `DB_PASSWORD` with your MySQL credentials.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode

```bash
# Build the project
npm run build

# Start the server
npm start
```

## 📡 API Endpoints

### 1. Refresh Countries Data

**POST** `/countries/refresh`

Fetches all countries and exchange rates from external APIs, then caches them in the database.

**Response:**
```json
{
  "message": "Countries data refreshed successfully",
  "count": 250
}
```

### 2. Get All Countries

**GET** `/countries`

Get all countries from the database with optional filters and sorting.

**Query Parameters:**
- `region` - Filter by region (e.g., `Africa`, `Europe`)
- `currency` - Filter by currency code (e.g., `NGN`, `USD`)
- `sort` - Sort results:
  - `gdp_desc` - Sort by GDP (descending)
  - `gdp_asc` - Sort by GDP (ascending)
  - `name_asc` - Sort by name (A-Z)
  - `name_desc` - Sort by name (Z-A)
  - `population_desc` - Sort by population (descending)
  - `population_asc` - Sort by population (ascending)

**Examples:**
```bash
GET /countries?region=Africa
GET /countries?currency=NGN
GET /countries?region=Africa&sort=gdp_desc
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-22T18:00:00Z"
  }
]
```

### 3. Get Country by Name

**GET** `/countries/:name`

Get a specific country by name.

**Example:**
```bash
GET /countries/Nigeria
```

**Response:**
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}
```

### 4. Delete Country

**DELETE** `/countries/:name`

Delete a country record by name.

**Example:**
```bash
DELETE /countries/Nigeria
```

**Response:**
```json
{
  "message": "Country deleted successfully"
}
```

### 5. Get Status

**GET** `/status`

Get the total number of countries and the last refresh timestamp.

**Response:**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}
```

### 6. Get Summary Image

**GET** `/countries/image`

Serves the generated summary image showing:
- Total number of countries
- Top 5 countries by estimated GDP
- Last refresh timestamp

**Response:** PNG image file

## 🧪 Testing the API

You can test the API using:

### Using curl

```bash
# Refresh countries data
curl -X POST http://localhost:3000/countries/refresh

# Get all countries
curl http://localhost:3000/countries

# Get countries in Africa
curl http://localhost:3000/countries?region=Africa

# Get a specific country
curl http://localhost:3000/countries/Nigeria

# Get status
curl http://localhost:3000/status

# Get summary image
curl http://localhost:3000/countries/image --output summary.png
```

### Using Postman or Thunder Client

1. Import the endpoints into your API client
2. Test each endpoint according to the documentation above

## 🗂️ Project Structure

```
HNG13-Stage-2-Backend-Task/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── models/
│   │   └── Country.ts            # Country entity/model
│   ├── controllers/
│   │   └── country.controller.ts # Request handlers
│   ├── services/
│   │   ├── country.service.ts    # Business logic
│   │   ├── externalAPI.service.ts # External API calls
│   │   └── imageGenerator.service.ts # Image generation
│   ├── routes/
│   │   ├── country.routes.ts     # Country routes
│   │   └── status.routes.ts      # Status routes
│   ├── middlewares/
│   │   └── errorHandler.ts       # Error handling middleware
│   ├── cache/
│   │   └── summary.png           # Generated summary image
│   └── index.ts                  # Application entry point
├── .env                          # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Dependencies

### Main Dependencies
- `express` - Web framework
- `typeorm` - ORM for database operations
- `mysql2` - MySQL driver
- `axios` - HTTP client for API calls
- `canvas` - Image generation
- `dotenv` - Environment variable management
- `reflect-metadata` - Required for TypeORM decorators

### Dev Dependencies
- `typescript` - TypeScript compiler
- `ts-node-dev` - TypeScript execution and hot reload
- `@types/node` - Node.js type definitions
- `@types/express` - Express type definitions

## 🔧 Configuration

### TypeScript Configuration

The project uses TypeScript

### Database Configuration

The application uses TypeORM with MySQL. The database schema is automatically created based on the Country entity model.

## ⚠️ Error Handling

The API returns consistent JSON error responses:

- **400 Bad Request** - Validation errors
```json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```

- **404 Not Found** - Resource not found
```json
{
  "error": "Country not found"
}
```

- **500 Internal Server Error** - Server errors
```json
{
  "error": "Internal server error"
}
```

- **503 Service Unavailable** - External API failures
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from [API name]"
}
```

## 🌐 Deployment

This API can be deployed to various platforms:

### Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Heroku
1. Create a new app on Heroku
2. Add MySQL addon (ClearDB or JawsDB)
3. Set environment variables
4. Deploy using Git

### AWS
1. Use AWS Elastic Beanstalk or EC2
2. Set up RDS for MySQL
3. Configure environment variables
4. Deploy

### Other Options
- Google Cloud Platform
- DigitalOcean
- Azure


## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_USERNAME` | Database username | root |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | countries_db |
| `COUNTRIES_API_URL` | Countries API endpoint | RestCountries URL |
| `EXCHANGE_RATE_API_URL` | Exchange rate API endpoint | Open Exchange Rates URL |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Your Name - [C3Techie]

## 🙏 Acknowledgments

- [RestCountries API](https://restcountries.com/)
- [Open Exchange Rates API](https://open.er-api.com/)
- HNG Internship Program
