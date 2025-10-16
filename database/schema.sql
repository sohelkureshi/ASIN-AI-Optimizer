-- Create database
CREATE DATABASE IF NOT EXISTS amazon_optimizer;
USE amazon_optimizer;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS product_optimizations;

-- Create product_optimizations table
CREATE TABLE product_optimizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(10) NOT NULL,
  
  -- Original data from Amazon
  original_title TEXT NOT NULL,
  original_bullet_points JSON NOT NULL,
  original_description TEXT,
  
  -- Optimized data from Gemini AI
  optimized_title TEXT NOT NULL,
  optimized_bullet_points JSON NOT NULL,
  optimized_description TEXT NOT NULL,
  keywords JSON NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Index for faster ASIN lookups
  INDEX idx_asin (asin),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample query to verify table creation
DESCRIBE product_optimizations;
