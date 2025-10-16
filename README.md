# Amazon Product Listing Optimizer (ASIN-AI-Optimizer)

An AI-powered web application that optimizes Amazon product listings using Gemini AI.  
Enter an ASIN, and the app fetches product details from Amazon, then uses AI to generate improved titles, bullet points, descriptions, and keyword suggestions.

---

## Features

- ASIN-based product fetching – Enter any Amazon ASIN to fetch product details directly from Amazon.  
- AI-powered optimization – Uses Gemini AI to generate:
  - Keyword-rich and readable product titles  
  - Clear and concise bullet points  
  - Persuasive and compliant descriptions  
  - 3–5 keyword suggestions for better SEO  
- Side-by-side comparison – View original and optimized content together.  
- Optimization history – Track all optimizations with timestamps for each ASIN.  
- MySQL storage – All data is stored locally for historical analysis and tracking improvements.

---

## Tech Stack

### Backend
- Node.js with Express.js  
- MySQL for database storage  
- Puppeteer for web scraping Amazon product pages  
- Cheerio for HTML parsing  
- Gemini AI API for content optimization  

### Frontend
- React (v18) for UI components  
- Axios for API communication  
- CSS3 for responsive design  

---

## Project Structure

```

amazon-listing-optimizer/
├── backend/
│   ├── config/
│   │   └── database.js              # MySQL connection pool
│   ├── controllers/
│   │   └── productController.js     # Request handlers
│   ├── models/
│   │   └── Product.js               # Database queries
│   ├── routes/
│   │   └── productRoutes.js         # API routes
│   ├── services/
│   │   ├── amazonScraper.js         # Amazon scraping logic
│   │   └── geminiService.js         # Gemini AI integration
│   ├── middleware/
│   │   └── errorHandler.js          # Error handling
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ASINInput.jsx        # ASIN input form
│   │   │   ├── ComparisonView.jsx   # Side-by-side display
│   │   │   └── HistoryList.jsx      # Optimization history
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── schema.sql                   # MySQL schema
│
└── README.md

````

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Gemini AI API key

---

### 1. Clone the Repository
```bash
git clone https://github.com/sohelkureshi/ASIN-AI-Optimizer
cd ASIN-AI-Optimizer
````

---

### 2. Database Setup

```bash
mysql -u root -p
```

Then run:

```bash
source database/schema.sql
```

Or manually execute the SQL file.

---

### 3. Backend Setup

```bash
cd backend
npm install

```

**Create Backend .env Configuration**

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amazon_optimizer
GEMINI_AI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
node server.js
```

For development with auto-reload:

```bash
npm run dev
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

**Create Frontend .env Configuration**

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### POST /api/products/optimize

Fetches product details from Amazon and optimizes using AI.

**Request Body**

```json
{
  "asin": "B08N5WRWNW"
}
```

**Response**

```json
{
  "success": true,
  "id": 1,
  "original": {
    "asin": "B08N5WRWNW",
    "title": "Original product title",
    "bulletPoints": ["Point 1", "Point 2"],
    "description": "Original description"
  },
  "optimized": {
    "title": "Optimized keyword-rich title",
    "bulletPoints": ["Improved point 1", "Improved point 2"],
    "description": "Enhanced persuasive description",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}
```

---

### GET /api/products/history/:asin

Retrieves optimization history for a specific ASIN.

**Response**

```json
{
  "success": true,
  "asin": "B08N5WRWNW",
  "count": 5,
  "history": [...]
}
```

---

## Gemini AI Prompt Strategy

### System Prompt

You are an expert Amazon product listing optimizer. Always respond with valid JSON format.

### User Prompt Structure

1. Context Setting – Defines role as Amazon listing expert
2. Input Data – Provides original title, bullet points, and description
3. Task Definition – Specifies:

   * Improved title (max 200 chars, keyword-rich)
   * 5 rewritten bullet points (clear, benefit-focused)
   * Enhanced description (200–300 words)
   * 3–5 keyword suggestions
4. Output Format – JSON for consistent parsing

---

## Why This Approach Works

* Structured output ensures easy parsing
* Clear constraints improve response quality
* Follows Amazon’s guidelines
* Focused on SEO and readability
* Highlights customer benefits instead of only features

---

## Database Schema

### product_optimizations Table

| Column                  | Type                              | Description                  |
| ----------------------- | --------------------------------- | ---------------------------- |
| id                      | INT (Primary Key, Auto Increment) | Primary key                  |
| asin                    | VARCHAR(10)                       | Amazon product identifier    |
| original_title          | TEXT                              | Original product title       |
| original_bullet_points  | JSON                              | Original bullet points       |
| original_description    | TEXT                              | Original description         |
| optimized_title         | TEXT                              | AI-generated title           |
| optimized_bullet_points | JSON                              | AI-generated bullet points   |
| optimized_description   | TEXT                              | AI-enhanced description      |
| keywords                | JSON                              | AI-suggested keywords        |
| created_at              | TIMESTAMP                         | Auto-generated on insert     |
| updated_at              | TIMESTAMP                         | Auto-updated on modification |

Indexes:

* idx_asin for fast ASIN lookups
* idx_created_at for chronological sorting

---

## Technical Choices

### Puppeteer for Web Scraping

* Handles dynamic content rendering
* Mimics real browser behavior
* More reliable than simple HTTP scraping

### MySQL Database

* Structured and ACID-compliant
* JSON support for flexible data
* Indexing for faster lookups

### Gemini AI

* Cost-effective and fast
* Produces consistent JSON output

### React Frontend

* Reusable components
* Smooth and responsive UI
* Easy state management

### Express.js Backend

* Lightweight and simple
* Easy to add middleware and routes

---

## Usage

1. Enter a valid 10-character ASIN (e.g., B08N5WRWNW)
2. Click "Optimize Listing" to fetch and enhance the product
3. Compare original and optimized content
4. View past optimizations with timestamps
5. Track improvements over time

---

## Limitations

* Amazon HTML structure changes may affect scraping
* Gemini AI API has rate limits
* Works only with valid Amazon.com ASINs
* Check Amazon’s Terms of Service for scraping rules

---

## Future Enhancements

* Add support for multiple Amazon marketplaces
* Add A/B testing tracking
* Add bulk ASIN processing
* Generate SEO score comparisons
* Export optimizations to CSV or PDF

---

## License

MIT License

---

## Author

Developed by Sohel Kureshi
A demonstration of full-stack development with AI integration.

---




>>>>>>> ea6e5b4 (updated readme.md)
