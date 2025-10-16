const db = require('../config/database');

class Product {
  // Save product optimization to database
  static async saveOptimization(data) {
    const {
      asin,
      originalTitle,
      originalBulletPoints,
      originalDescription,
      optimizedTitle,
      optimizedBulletPoints,
      optimizedDescription,
      keywords
    } = data;

    const query = `
      INSERT INTO product_optimizations 
      (asin, original_title, original_bullet_points, original_description, 
       optimized_title, optimized_bullet_points, optimized_description, keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      asin,
      originalTitle,
      JSON.stringify(originalBulletPoints),
      originalDescription,
      optimizedTitle,
      JSON.stringify(optimizedBulletPoints),
      optimizedDescription,
      JSON.stringify(keywords)
    ];

    try {
      const [result] = await db.execute(query, values);
      return result.insertId;
    } catch (error) {
      throw new Error(`Database save error: ${error.message}`);
    }
  }

  // Get optimization history for a specific ASIN
  static async getHistoryByAsin(asin) {
    const query = `
      SELECT * FROM product_optimizations 
      WHERE asin = ? 
      ORDER BY created_at DESC
    `;

    try {
      const [rows] = await db.execute(query, [asin]);
      
      // Parse JSON fields with error handling
      return rows.map(row => {
        try {
          // Parse bullet points
          let originalBulletPoints = [];
          let optimizedBulletPoints = [];
          let keywords = [];

          // Try to parse original_bullet_points
          try {
            originalBulletPoints = typeof row.original_bullet_points === 'string' 
              ? JSON.parse(row.original_bullet_points)
              : (Array.isArray(row.original_bullet_points) ? row.original_bullet_points : []);
          } catch (e) {
            console.error('Error parsing original_bullet_points:', e.message);
            originalBulletPoints = row.original_bullet_points ? [row.original_bullet_points] : [];
          }

          // Try to parse optimized_bullet_points
          try {
            optimizedBulletPoints = typeof row.optimized_bullet_points === 'string' 
              ? JSON.parse(row.optimized_bullet_points)
              : (Array.isArray(row.optimized_bullet_points) ? row.optimized_bullet_points : []);
          } catch (e) {
            console.error('Error parsing optimized_bullet_points:', e.message);
            optimizedBulletPoints = row.optimized_bullet_points ? [row.optimized_bullet_points] : [];
          }

          // Try to parse keywords
          try {
            keywords = typeof row.keywords === 'string' 
              ? JSON.parse(row.keywords)
              : (Array.isArray(row.keywords) ? row.keywords : []);
          } catch (e) {
            console.error('Error parsing keywords:', e.message);
            keywords = row.keywords ? [row.keywords] : [];
          }

          return {
            ...row,
            original_bullet_points: originalBulletPoints,
            optimized_bullet_points: optimizedBulletPoints,
            keywords: keywords
          };
        } catch (parseError) {
          console.error('Error parsing row:', parseError.message);
          // Return row with empty arrays if parsing fails
          return {
            ...row,
            original_bullet_points: [],
            optimized_bullet_points: [],
            keywords: []
          };
        }
      });
    } catch (error) {
      throw new Error(`Database fetch error: ${error.message}`);
    }
  }

  // Get all optimization history
  static async getAllHistory() {
    const query = `
      SELECT * FROM product_optimizations 
      ORDER BY created_at DESC
    `;

    try {
      const [rows] = await db.execute(query);
      
      // Parse JSON fields with error handling
      return rows.map(row => {
        try {
          // Parse bullet points
          let originalBulletPoints = [];
          let optimizedBulletPoints = [];
          let keywords = [];

          // Try to parse original_bullet_points
          try {
            originalBulletPoints = typeof row.original_bullet_points === 'string' 
              ? JSON.parse(row.original_bullet_points)
              : (Array.isArray(row.original_bullet_points) ? row.original_bullet_points : []);
          } catch (e) {
            console.error('Error parsing original_bullet_points:', e.message);
            originalBulletPoints = row.original_bullet_points ? [row.original_bullet_points] : [];
          }

          // Try to parse optimized_bullet_points
          try {
            optimizedBulletPoints = typeof row.optimized_bullet_points === 'string' 
              ? JSON.parse(row.optimized_bullet_points)
              : (Array.isArray(row.optimized_bullet_points) ? row.optimized_bullet_points : []);
          } catch (e) {
            console.error('Error parsing optimized_bullet_points:', e.message);
            optimizedBulletPoints = row.optimized_bullet_points ? [row.optimized_bullet_points] : [];
          }

          // Try to parse keywords
          try {
            keywords = typeof row.keywords === 'string' 
              ? JSON.parse(row.keywords)
              : (Array.isArray(row.keywords) ? row.keywords : []);
          } catch (e) {
            console.error('Error parsing keywords:', e.message);
            keywords = row.keywords ? [row.keywords] : [];
          }

          return {
            ...row,
            original_bullet_points: originalBulletPoints,
            optimized_bullet_points: optimizedBulletPoints,
            keywords: keywords
          };
        } catch (parseError) {
          console.error('Error parsing row:', parseError.message);
          // Return row with empty arrays if parsing fails
          return {
            ...row,
            original_bullet_points: [],
            optimized_bullet_points: [],
            keywords: []
          };
        }
      });
    } catch (error) {
      throw new Error(`Database fetch error: ${error.message}`);
    }
  }
}

module.exports = Product;
