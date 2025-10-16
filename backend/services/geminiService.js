const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async optimizeProductListing(productData) {
    try {
      const { title, bulletPoints, description } = productData;

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-lite',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          responseMimeType: 'application/json'
        }
      });

      const prompt = `You are an expert Amazon product listing optimizer. Given the following product information, generate optimized content that is keyword-rich, persuasive, and compliant with Amazon's guidelines.

                        Original Title: ${title}
                        Original Bullet Points: ${bulletPoints.join('; ')}
                        Original Description: ${description}

                        Please provide:
                        1. An improved title (max 200 characters, keyword-rich and readable)
                        2. 5 rewritten bullet points (each clear, concise, and benefit-focused)
                        3. An enhanced description (persuasive but compliant, around 200-300 words)
                        4. 3-5 new keyword suggestions for better SEO

                        Respond with valid JSON in this exact format:
                        {
                          "optimizedTitle": "your optimized title here",
                          "optimizedBulletPoints": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
                          "optimizedDescription": "your enhanced description here",
                          "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
                        }`;

      console.log('Sending request to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Raw Gemini response:', text.substring(0, 200));

      // Better JSON cleaning - remove all markdown formatting
      let cleanedText = text.trim();
      
      // Remove markdown code blocks
      cleanedText = cleanedText.replace(/```\s*/g, '');
      
      // Remove any leading/trailing whitespace
      cleanedText = cleanedText.trim();
      
      // Find JSON object boundaries
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
      }

      console.log('Cleaned JSON:', cleanedText.substring(0, 200));

      // Parse JSON response
      const optimizedData = JSON.parse(cleanedText);

      // Validate response structure
      if (!optimizedData.optimizedTitle || !optimizedData.optimizedBulletPoints || 
          !optimizedData.optimizedDescription || !optimizedData.keywords) {
        throw new Error('Invalid response structure from Gemini');
      }

      // Ensure we have exactly 5 bullet points
      if (optimizedData.optimizedBulletPoints.length < 5) {
        while (optimizedData.optimizedBulletPoints.length < 5) {
          optimizedData.optimizedBulletPoints.push('Premium quality product');
        }
      }

      // Ensure we have at least 3 keywords
      if (optimizedData.keywords.length < 3) {
        while (optimizedData.keywords.length < 3) {
          optimizedData.keywords.push('amazon');
        }
      }

      console.log('Successfully optimized product');

      return {
        optimizedTitle: optimizedData.optimizedTitle,
        optimizedBulletPoints: optimizedData.optimizedBulletPoints.slice(0, 5),
        optimizedDescription: optimizedData.optimizedDescription,
        keywords: optimizedData.keywords.slice(0, 5)
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // If JSON parsing fails, return a fallback response
      if (error instanceof SyntaxError) {
        console.log('JSON parsing failed, using fallback optimization');
        
        return {
          optimizedTitle: productData.title.substring(0, 200),
          optimizedBulletPoints: productData.bulletPoints.slice(0, 5).length > 0 
            ? productData.bulletPoints.slice(0, 5)
            : [
                'High quality product with excellent features',
                'Designed for optimal performance and durability',
                'Easy to use and install',
                'Great value for money',
                'Customer satisfaction guaranteed'
              ],
          optimizedDescription: productData.description || 'This product offers exceptional quality and value. Perfect for everyday use with reliable performance.',
          keywords: ['premium', 'quality', 'value', 'durable', 'reliable']
        };
      }
      
      throw new Error(`Gemini optimization failed: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
