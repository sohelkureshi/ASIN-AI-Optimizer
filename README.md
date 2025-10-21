# Amazon Product Listing Optimizer (ASIN-AI-Optimizer)

AI web app to fetch an Amazon product by ASIN and generate an improved title, five bullet points, a richer description, and keyword suggestions using Gemini. Data is saved in MySQL and you can view optimization history per ASIN.  
Live demo: https://asin-ai-optimizer.netlify.app/

***

## Features
- Enter an ASIN to fetch product details with resilient scraping and fallbacks.  
- Generate optimized title, 5 benefit-focused bullets, enhanced description, and 3–5 keywords in strict JSON.  
- Side-by-side comparison of original vs optimized content.  
- Optimization history per ASIN with timestamps and safe JSON parsing.  
- Auto-detect marketplace (US → IN → UK), returns the detected marketplace.

***

## Tech Stack

### Backend
- Node.js, Express, mysql2/promise  
- Puppeteer (dev) or puppeteer-core + @sparticuz/chromium (prod)  
- Cheerio  
- @google/generative-ai (model: gemini-2.0-flash-lite)

### Frontend
- React 18  
- Axios  
- CSS

***

## Setup Instructions

### Prerequisites
- Node.js v16+  
- MySQL v8+  
- Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/sohelkureshi/ASIN-AI-Optimizer
cd ASIN-AI-Optimizer
```

### 2. Database Setup
Use the provided schema file:
```bash
mysql -u root -p
source database/schema.sql
```
Or run equivalent SQL manually.

### 3. Backend Setup
```bash
cd backend
npm install
```

#### Create Backend .env Configuration
```
PORT=5000
# EITHER single connection string:
DATABASE_URL=mysql://user:pass@host:3306/amazon_optimizer
# OR discrete variables:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amazon_optimizer

# CORS allow-list for your frontend:
FRONTEND_URL=http://localhost:3000

# Gemini:
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:
```bash
node server.js
```
You should see successful MySQL connection logs and the server on http://localhost:5000.

### 4. Frontend Setup
```bash
cd frontend
npm install
```

#### Create Frontend .env Configuration
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```
Opens at http://localhost:3000.

***

## API Endpoints

### POST /api/products/optimize
Fetches product details by ASIN and generates optimized content.  
Request:
```json
{
  "asin": "B08N5WRWNW",
  "marketplace": null
}
```
Note: marketplace is optional; null/omit to auto-detect (US → IN → UK).  
Response (shape):
```json
{
  "success": true,
  "id": 123,
  "marketplace": "US",
  "original": {
    "asin": "B08N5WRWNW",
    "title": "Original product title",
    "bulletPoints": ["Point 1", "Point 2"],
    "description": "Original description"
  },
  "optimized": {
    "title": "Optimized keyword-rich title",
    "bulletPoints": ["Improved 1", "Improved 2", "Improved 3", "Improved 4", "Improved 5"],
    "description": "Enhanced persuasive description",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}
```

### GET /api/products/history/:asin
Returns optimization history for an ASIN with parsed arrays.  
Response (shape):
```json
{
  "success": true,
  "asin": "B08N5WRWNW",
  "count": 5,
  "history": [ ... ]
}
```

***

## Gemini AI Prompt Strategy

### System Prompt
You are an expert Amazon product listing optimizer. Always respond with valid JSON format.

### User Prompt Structure
- Context: Defines the role as Amazon listing expert.  
- Input: Original title, bullet points, and description.  
- Task: Create improved title (≤200 chars), 5 clear benefit-focused bullets, a 200–300 word description, and 3–5 keywords.  
- Output: Strict JSON with keys optimizedTitle, optimizedBulletPoints, optimizedDescription, keywords.  
- Notes: The service trims code fences, extracts JSON, validates shape, pads bullets/keywords if short, and has a safe fallback if JSON parsing fails.

***

## Database Schema

### product_optimizations Table
- id (INT, PK, auto-increment)  
- asin (VARCHAR(10))  
- original_title (TEXT)  
- original_bullet_points (JSON)  
- original_description (TEXT)  
- optimized_title (TEXT)  
- optimized_bullet_points (JSON)  
- optimized_description (TEXT)  
- keywords (JSON)  
- created_at (TIMESTAMP)  
- updated_at (TIMESTAMP)

Indexes:  
- idx_asin for fast ASIN lookups  
- idx_created_at for sorting

***

## Technical Choices
- Scraper auto-detects US → IN → UK and returns the first successful marketplace.  
- Multiple selectors for title, bullets, and description; generic bullets are added if none found.  
- Production uses puppeteer-core + @sparticuz/chromium and blocks images, stylesheets, fonts, and media to reduce load and timeouts.  
- MySQL pool supports DATABASE_URL or discrete env vars; arrays stored in JSON columns.

***

## Usage
1) Enter a valid 10-character ASIN (e.g., B08N5WRWNW).  
2) Click “Optimize Listing” to fetch and enhance.  
3) Compare original vs optimized content side by side.  
4) Open “History” to see past runs with timestamps.

***

## Limitations
- Scraping depends on Amazon HTML; changes can affect extraction.  
- Gemini can return non-JSON; the service cleans and validates and uses a safe fallback if parsing fails.  
- Supported marketplaces: US, IN, UK only at present.

***

## Future Enhancements
- Add more marketplaces (JP/DE/FR, etc.).  
- Bulk ASIN processing and export (CSV/PDF).  
- A/B testing and SEO score comparisons.

***

## License
MIT

***

## Author
Sohel Kureshi
