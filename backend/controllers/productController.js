const amazonScraper = require('../services/amazonScraper');
const geminiService = require('../services/geminiService');
const Product = require('../models/Product');

class ProductController {
  // Fetch and optimize product listing
 async optimizeProduct(req, res, next) {
  try {
    const { asin, marketplace } = req.body;

    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }

    // Step 1: Fetch product details from Amazon
    console.log(`Fetching product details for ASIN: ${asin}, Marketplace: ${marketplace || 'auto'}`);
    const productData = await amazonScraper.fetchProductDetails(asin, marketplace);

    // Rest of the code remains the same...
    console.log('Optimizing product listing with Gemini AI');
    const optimizedData = await geminiService.optimizeProductListing(productData);

    console.log('Saving optimization to database');
    const insertId = await Product.saveOptimization({
      asin: productData.asin,
      originalTitle: productData.title,
      originalBulletPoints: productData.bulletPoints,
      originalDescription: productData.description,
      optimizedTitle: optimizedData.optimizedTitle,
      optimizedBulletPoints: optimizedData.optimizedBulletPoints,
      optimizedDescription: optimizedData.optimizedDescription,
      keywords: optimizedData.keywords
    });

    res.json({
      success: true,
      id: insertId,
      marketplace: productData.marketplace,
      original: {
        asin: productData.asin,
        title: productData.title,
        bulletPoints: productData.bulletPoints,
        description: productData.description
      },
      optimized: {
        title: optimizedData.optimizedTitle,
        bulletPoints: optimizedData.optimizedBulletPoints,
        description: optimizedData.optimizedDescription,
        keywords: optimizedData.keywords
      }
    });

  } catch (error) {
    next(error);
  }
}


  // Get optimization history for specific ASIN
  async getHistory(req, res, next) {
    try {
      const { asin } = req.params;

      if (!asin) {
        return res.status(400).json({ error: 'ASIN is required' });
      }

      const history = await Product.getHistoryByAsin(asin);

      res.json({
        success: true,
        asin,
        count: history.length,
        history
      });

    } catch (error) {
      next(error);
    }
  }

  // Get all optimization history
  async getAllHistory(req, res, next) {
    try {
      const history = await Product.getAllHistory();

      res.json({
        success: true,
        count: history.length,
        history
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
