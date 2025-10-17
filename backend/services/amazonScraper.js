// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');

// class AmazonScraper {
//   // Get the correct Amazon URL based on marketplace
//   getAmazonUrl(asin, marketplace = 'us') {
//     const marketplaceUrls = {
//       'us': `https://www.amazon.com/dp/${asin}`,
//       'in': `https://www.amazon.in/dp/${asin}`,
//       'uk': `https://www.amazon.co.uk/dp/${asin}`
//     };
//     return marketplaceUrls[marketplace] || marketplaceUrls['us'];
//   }

//   // Automatically try all marketplaces until one works
//   async fetchProductDetails(asin) {
//     const marketplaces = ['us', 'in', 'uk'];
//     let lastError = null;
    
//     console.log(`\n Starting auto-detection for ASIN: ${asin}`);
//     console.log('Will try marketplaces in order: US → India → UK\n');
    
//     for (const market of marketplaces) {
//       try {
//         console.log(`Attempting to scrape from Amazon ${market.toUpperCase()}...`);
//         const result = await this.scrapeFromMarketplace(asin, market);
//         console.log(`Successfully scraped from Amazon ${market.toUpperCase()}`);
//         return result;
//       } catch (error) {
//         console.log(`Failed to scrape from Amazon ${market.toUpperCase()}: ${error.message}`);
//         lastError = error;
//         // Continue to next marketplace
//       }
//     }
    
//     // If all marketplaces failed, throw the last error
//     console.log('\n Failed to scrape from all Amazon marketplaces\n');
//     throw lastError || new Error('Failed to scrape from all Amazon marketplaces (US, India, UK)');
//   }

//   async scrapeFromMarketplace(asin, marketplace) {
//     const url = this.getAmazonUrl(asin, marketplace);
    
//     let browser;
//     try {
//       browser = await puppeteer.launch({
//         headless: 'new',
//         args: [
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//           '--disable-blink-features=AutomationControlled',
//           '--disable-dev-shm-usage'
//         ]
//       });

//       const page = await browser.newPage();
      
//       // Set user agent based on marketplace
//       const userAgents = {
//         'us': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//         'in': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//         'uk': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//       };
      
//       await page.setUserAgent(userAgents[marketplace] || userAgents['us']);

//       // Set additional headers
//       await page.setExtraHTTPHeaders({
//         'Accept-Language': marketplace === 'in' ? 'en-IN,en;q=0.9' : 'en-US,en;q=0.9',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
//       });

//       await page.setViewport({ width: 1920, height: 1080 });

//       console.log(`   Navigating to: ${url}`);
//       await page.goto(url, { 
//         waitUntil: 'networkidle2', 
//         timeout: 60000 
//       });

//       // Wait for product title (works for all marketplaces)
//       await page.waitForSelector('#productTitle, #title', { timeout: 10000 }).catch(() => {
//         console.log('   Title selector not found, continuing...');
//       });

//       const html = await page.content();
//       const $ = cheerio.load(html);

//       // Extract product title - multiple selectors for different marketplaces
//       let title = $('#productTitle').text().trim();
//       if (!title) title = $('#title').text().trim();
//       if (!title) title = $('span[id="productTitle"]').text().trim();
//       if (!title) title = $('h1.a-size-large').text().trim();

//       // Extract bullet points - works for all Amazon marketplaces
//       const bulletPoints = [];
      
//       // Method 1: Standard feature bullets (US, UK, IN)
//       $('#feature-bullets ul li span.a-list-item').each((i, element) => {
//         const text = $(element).text().trim();
//         if (text && text.length > 10 && !text.includes('See more product details')) {
//           bulletPoints.push(text);
//         }
//       });

//       // Method 2: Alternative selectors for India
//       if (bulletPoints.length === 0) {
//         $('#feature-bullets li').each((i, element) => {
//           const text = $(element).text().trim();
//           if (text && text.length > 10 && !text.includes('See more product details')) {
//             bulletPoints.push(text);
//           }
//         });
//       }

//       // Method 3: Product details section (common in Amazon India)
//       if (bulletPoints.length === 0) {
//         $('.a-unordered-list .a-list-item').each((i, element) => {
//           const text = $(element).text().trim();
//           if (text && text.length > 10 && !text.includes('See more product details')) {
//             bulletPoints.push(text);
//           }
//         });
//       }

//       // Method 4: Try detail bullets (fallback for Amazon India)
//       if (bulletPoints.length === 0) {
//         $('#detailBullets_feature_div ul li').each((i, element) => {
//           const text = $(element).text().trim();
//           if (text && text.length > 10) {
//             bulletPoints.push(text);
//           }
//         });
//       }

//       // Extract description - works for all marketplaces
//       let description = $('#productDescription p').text().trim();
      
//       if (!description) {
//         description = $('#productDescription').text().trim();
//       }
      
//       if (!description) {
//         description = $('#feature-bullets').text().trim();
//       }

//       if (!description) {
//         description = $('.a-expander-content').text().trim();
//       }

//       // Clean up description
//       description = description.replace(/\s+/g, ' ').trim().substring(0, 1000);

//       await browser.close();

//       // Validation
//       if (!title || title.length < 10) {
//         throw new Error(`Unable to extract valid product title. The ASIN may be invalid or not available in ${marketplace.toUpperCase()} marketplace.`);
//       }

//       // If no bullets found, create generic ones
//       if (bulletPoints.length === 0) {
//         bulletPoints.push('High quality product');
//         bulletPoints.push('Customer favorite');
//         bulletPoints.push('Great value for money');
//         bulletPoints.push('Reliable performance');
//         bulletPoints.push('Easy to use');
//       }

//       console.log(`   ✓ Extracted: Title (${title.length} chars), ${bulletPoints.length} bullets, ${description.length} chars description`);

//       return {
//         asin,
//         marketplace: marketplace.toUpperCase(),
//         title,
//         bulletPoints: bulletPoints.slice(0, 5),
//         description: description || 'No description available'
//       };

//     } catch (error) {
//       if (browser) {
//         await browser.close();
//       }
//       throw new Error(`${error.message}`);
//     }
//   }
// }

// module.exports = new AmazonScraper();
// 

const cheerio = require('cheerio');

// Use puppeteer-core + chromium for production (Render)
// Use regular puppeteer for local development
let puppeteer;
let chromium;

if (process.env.NODE_ENV === 'production') {
  puppeteer = require('puppeteer-core');
  chromium = require('@sparticuz/chromium');
} else {
  puppeteer = require('puppeteer');
}

class AmazonScraper {
  getAmazonUrl(asin, marketplace = 'us') {
    const marketplaceUrls = {
      'us': `https://www.amazon.com/dp/${asin}`,
      'in': `https://www.amazon.in/dp/${asin}`,
      'uk': `https://www.amazon.co.uk/dp/${asin}`
    };
    return marketplaceUrls[marketplace] || marketplaceUrls['us'];
  }

  async fetchProductDetails(asin) {
    const marketplaces = ['us', 'in', 'uk'];
    let lastError = null;
    
    console.log('\nStarting auto-detection for ASIN:', asin);
    console.log('Will try marketplaces in order: US -> India -> UK\n');
    
    for (const market of marketplaces) {
      try {
        console.log('Attempting to scrape from Amazon', market.toUpperCase());
        const result = await this.scrapeFromMarketplace(asin, market);
        console.log('Successfully scraped from Amazon', market.toUpperCase());
        return result;
      } catch (error) {
        console.log('Failed to scrape from Amazon', market.toUpperCase(), ':', error.message);
        lastError = error;
      }
    }
    
    console.log('\nFailed to scrape from all Amazon marketplaces\n');
    throw lastError || new Error('Failed to scrape from all Amazon marketplaces (US, India, UK)');
  }

  async scrapeFromMarketplace(asin, marketplace) {
    const url = this.getAmazonUrl(asin, marketplace);
    
    let browser;
    try {
      // Different launch config for production vs local
      let launchConfig;

      if (process.env.NODE_ENV === 'production') {
        // Production (Render) - Use chromium
        launchConfig = {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless
        };
      } else {
        // Local development - Use regular puppeteer
        launchConfig = {
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage'
          ]
        };
      }

      browser = await puppeteer.launch(launchConfig);

      const page = await browser.newPage();
      
      const userAgents = {
        'us': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'in': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'uk': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      };
      
      await page.setUserAgent(userAgents[marketplace] || userAgents['us']);

      await page.setExtraHTTPHeaders({
        'Accept-Language': marketplace === 'in' ? 'en-IN,en;q=0.9' : 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      });

      await page.setViewport({ width: 1920, height: 1080 });

      console.log('  Navigating to:', url);
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });

      await page.waitForSelector('#productTitle, #title', { timeout: 10000 }).catch(() => {
        console.log('  Title selector not found, continuing...');
      });

      const html = await page.content();
      const $ = cheerio.load(html);

      let title = $('#productTitle').text().trim();
      if (!title) title = $('#title').text().trim();
      if (!title) title = $('span[id="productTitle"]').text().trim();
      if (!title) title = $('h1.a-size-large').text().trim();

      const bulletPoints = [];
      
      $('#feature-bullets ul li span.a-list-item').each((i, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 10 && !text.includes('See more product details')) {
          bulletPoints.push(text);
        }
      });

      if (bulletPoints.length === 0) {
        $('#feature-bullets li').each((i, element) => {
          const text = $(element).text().trim();
          if (text && text.length > 10 && !text.includes('See more product details')) {
            bulletPoints.push(text);
          }
        });
      }

      if (bulletPoints.length === 0) {
        $('.a-unordered-list .a-list-item').each((i, element) => {
          const text = $(element).text().trim();
          if (text && text.length > 10 && !text.includes('See more product details')) {
            bulletPoints.push(text);
          }
        });
      }

      if (bulletPoints.length === 0) {
        $('#detailBullets_feature_div ul li').each((i, element) => {
          const text = $(element).text().trim();
          if (text && text.length > 10) {
            bulletPoints.push(text);
          }
        });
      }

      let description = $('#productDescription p').text().trim();
      
      if (!description) {
        description = $('#productDescription').text().trim();
      }
      
      if (!description) {
        description = $('#feature-bullets').text().trim();
      }

      if (!description) {
        description = $('.a-expander-content').text().trim();
      }

      description = description.replace(/\s+/g, ' ').trim().substring(0, 1000);

      await browser.close();

      if (!title || title.length < 10) {
        throw new Error('Unable to extract valid product title. The ASIN may be invalid or not available in ' + marketplace.toUpperCase() + ' marketplace.');
      }

      if (bulletPoints.length === 0) {
        bulletPoints.push('High quality product');
        bulletPoints.push('Customer favorite');
        bulletPoints.push('Great value for money');
        bulletPoints.push('Reliable performance');
        bulletPoints.push('Easy to use');
      }

      console.log('  Extracted: Title (' + title.length + ' chars), ' + bulletPoints.length + ' bullets, ' + description.length + ' chars description');

      return {
        asin,
        marketplace: marketplace.toUpperCase(),
        title,
        bulletPoints: bulletPoints.slice(0, 5),
        description: description || 'No description available'
      };

    } catch (error) {
      if (browser) {
        await browser.close();
      }
      throw new Error(error.message);
    }
  }
}

module.exports = new AmazonScraper();
