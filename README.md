# Amazon Product Listing Optimizer

An AI-powered web application that optimizes Amazon product listings using Gemini AI's model. Enter an ASIN, and the app fetches product details from Amazon, then uses AI to generate improved titles, bullet points, descriptions, and keyword suggestions.

## Features

- **ASIN-based Product Fetching**: Enter any Amazon ASIN to fetch product details directly from Amazon
- **AI-Powered Optimization**: Uses Gemini AI to generate:
  - Keyword-rich and readable product titles
  - Clear and concise bullet points
  - Persuasive and compliant descriptions
  - 3-5 new keyword suggestions for better SEO
- **Side-by-Side Comparison**: View original and optimized content in a clean, comparative layout
- **Optimization History**: Track all optimizations with timestamps for each ASIN
- **MySQL Storage**: All data is stored locally for historical analysis and tracking improvements

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** for database storage
- **Puppeteer** for web scraping Amazon product pages
- **Cheerio** for HTML parsing
- **Gemini AI API** for content optimization

### Frontend
- **React** (v18) for UI components
- **Axios** for API communication
- **CSS3** for responsive styling

## Project Structure

amazon-listing-optimizer/
│
├── backend/
│ ├── config/
│ │ └── database.js # MySQL connection pool
│ ├── controllers/
│ │ └── productController.js # Request handlers
│ ├── models/
│ │ └── Product.js # Database queries
│ ├── routes/
│ │ └── productRoutes.js # API routes
│ ├── services/
│ │ ├── amazonScraper.js # Amazon scraping logic
│ │ └── geminiService.js # Gemini AI integration
│ ├── middleware/
│ │ └── errorHandler.js # Error handling
│ ├── .env.example
│ ├── package.json
│ └── server.js # Entry point
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── ASINInput.jsx # ASIN input form
│ │ │ ├── ComparisonView.jsx # Side-by-side display
│ │ │ └── HistoryList.jsx # Optimization history
│ │ ├── services/
│ │ │ └── api.js # API client
│ │ ├── App.jsx
│ │ ├── App.css
│ │ └── index.js
│ ├── .env.example
│ └── package.json
│
├── database/
│ └── schema.sql # MySQL schema
│
└── README.md

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Gemini AI API key

### 1. Clone the Repository
git clone <repository-url>
cd amazon-listing-optimizer



### 2. Database Setup
Login to MySQL
mysql -u root -p

Run the schema file
source database/schema.sql

Or manually execute the SQL file

### 3. Backend Setup
cd backend

Install dependencies
npm install

Create .env file
cp .env.example .env

Edit .env with your credentials
nano .env



**Backend .env Configuration:**
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amazon_optimizer
Gemini AI_API_KEY=your_Gemini AI_api_key


undefined
Start backend server
npm start

For development with auto-reload
npm run dev



### 4. Frontend Setup
cd frontend

Install dependencies
npm install

Create .env file
cp .env.example .env

Edit .env
nano .env



**Frontend .env Configuration:**
REACT_APP_API_URL=http://localhost:5000/api

text
undefined
Start frontend development server
npm start



The application will open at `http://localhost:3000`

## API Endpoints

### POST /api/products/optimize
Fetches product details from Amazon and optimizes using AI

**Request Body:**
{
"asin": "B08N5WRWNW"
}


**Response:**
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


### GET /api/products/history/:asin
Retrieves optimization history for a specific ASIN

**Response:**
{
"success": true,
"asin": "B08N5WRWNW",
"count": 5,
"history": [...]
}



### GET /api/products/history
Retrieves all optimization history

## Gemini AI Prompt Strategy

The application uses a carefully crafted prompt for Gemini AI. 

### System Prompt
You are an expert Amazon product listing optimizer. Always respond with valid JSON format.



### User Prompt Structure
1. **Context Setting**: Establishes the role as an Amazon listing expert
2. **Input Data**: Provides original title, bullet points, and description
3. **Task Definition**: Clearly specifies the four optimization tasks:
   - Improved title (max 200 chars, keyword-rich)
   - 5 rewritten bullet points (clear, benefit-focused)
   - Enhanced description (200-300 words, persuasive but compliant)
   - 3-5 keyword suggestions for SEO
4. **Output Format**: Enforces JSON structure for consistent parsing

### Why This Approach Works
- **Structured Output**: JSON format ensures reliable parsing
- **Clear Constraints**: Character limits and bullet point counts guide AI
- **Amazon Compliance**: Emphasizes Amazon's guidelines for content
- **SEO Focus**: Prioritizes keyword-rich, searchable content
- **Benefit-Oriented**: Focuses on customer benefits rather than just features

## Database Schema

### product_optimizations Table
id: INT (Primary Key, Auto-increment)

asin: VARCHAR(10) - Amazon product identifier

original_title: TEXT - Fetched from Amazon

original_bullet_points: JSON - Array of bullet points

original_description: TEXT - Product description

optimized_title: TEXT - AI-generated title

optimized_bullet_points: JSON - AI-generated bullets

optimized_description: TEXT - AI-enhanced description

keywords: JSON - AI-suggested keywords

created_at: TIMESTAMP - Auto-generated on insert

updated_at: TIMESTAMP - Auto-updated on modification



**Indexes:**
- `idx_asin`: For fast ASIN lookups
- `idx_created_at`: For chronological sorting

## Reasoning Behind Technical Choices

### 1. Puppeteer for Web Scraping
- **Dynamic Content**: Amazon uses JavaScript rendering, Puppeteer handles this
- **Headless Browser**: Mimics real user behavior, reduces detection
- **Reliability**: Better than simple HTTP requests for modern websites

### 2. MySQL over NoSQL
- **Structured Data**: Product listings have consistent schema
- **ACID Compliance**: Ensures data integrity for optimization history
- **JSON Support**: Modern MySQL supports JSON fields for flexible arrays
- **Query Performance**: Indexes on ASIN enable fast historical lookups

### 3. Gemini AI 
- **Cost-Effective**: Cheaper than OpenAI for this use case
- **Fast Response**: Suitable for real-time optimization
- **Reliable Output**: Consistent JSON formatting with proper prompting

### 4. React for Frontend
- **Component Reusability**: Modular components (Input, Comparison, History)
- **State Management**: Built-in hooks for managing optimization state
- **Performance**: Virtual DOM ensures smooth UI updates

### 5. Express.js for Backend
- **Lightweight**: Minimal overhead for API endpoints
- **Middleware Support**: Easy error handling and CORS setup
- **Wide Adoption**: Large ecosystem and community support

## Usage

1. **Enter ASIN**: Input a valid 10-character Amazon ASIN (e.g., B08N5WRWNW)
2. **Optimize**: Click "Optimize Listing" to fetch and enhance the product
3. **Compare**: View original vs optimized content side-by-side
4. **View History**: Check past optimizations for the same ASIN with timestamps
5. **Track Improvements**: Analyze how optimizations evolve over time

## Limitations & Considerations

- **Amazon Scraping**: May break if Amazon changes their HTML structure
- **Rate Limiting**: Gemini AI API has rate limits based on your plan
- **ASIN Validation**: Only works with valid Amazon.com ASINs
- **Scraping Legality**: Check Amazon's Terms of Service for your region

## Future Enhancements

- Add support for multiple Amazon marketplaces (UK, DE, IN, etc.)
- Implement A/B testing tracking for optimized listings
- Add bulk ASIN processing
- Generate SEO score comparison
- Export optimizations to CSV/PDF

## License

MIT

## Author

Developed as a demonstration of full-stack development with AI integration.#   A S I N - A I - O p t i m i z e r 
 
 