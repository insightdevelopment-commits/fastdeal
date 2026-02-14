const Groq = require('groq-sdk');

/**
 * Groq AI Service
 * Provides AI-powered features using Groq's fast inference
 */

let groqClient = null;

// Initialize Groq client if API key is available
if (process.env.GROQ_API_KEY) {
    try {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
        console.log('✓ Groq AI initialized');
    } catch (error) {
        console.warn('Groq initialization failed:', error.message);
    }
}

/**
 * Enhance search query using AI
 * Expands user query to include synonyms and related terms
 */
async function enhanceSearchQuery(query) {
    if (!groqClient) {
        return { enhanced: query, suggestions: [] };
    }

    try {
        const completion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a search query optimizer for e-commerce. Expand the user query to include synonyms, related terms, and common variations. Return a JSON object with "enhanced" (improved query) and "suggestions" (array of alternative search terms).'
                },
                {
                    role: 'user',
                    content: `Optimize this search query: "${query}"`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 200,
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        return {
            enhanced: result.enhanced || query,
            suggestions: result.suggestions || []
        };
    } catch (error) {
        console.error('Groq query enhancement error:', error.message);
        return { enhanced: query, suggestions: [] };
    }
}

/**
 * Generate product comparison insights
 */
async function compareProducts(products) {
    if (!groqClient || !products || products.length < 2) {
        return null;
    }

    try {
        const productSummary = products.slice(0, 5).map(p => ({
            title: p.title,
            price: p.price,
            vendor: p.vendor,
            rating: p.reviews?.avgRating
        }));

        const completion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a product comparison expert. Analyze the products and provide brief insights about the best value, quality, and trade-offs. Keep it concise (max 3 sentences).'
                },
                {
                    role: 'user',
                    content: `Compare these products:\n${JSON.stringify(productSummary, null, 2)}`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 150
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Groq product comparison error:', error.message);
        return null;
    }
}

/**
 * Detect user intent from search query
 */
async function detectIntent(query) {
    if (!groqClient) {
        return { intent: 'search', confidence: 1.0 };
    }

    try {
        const completion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Analyze the search query and return JSON with "intent" (one of: search, compare, budget, premium, specific_brand) and "confidence" (0-1).'
                },
                {
                    role: 'user',
                    content: query
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
            max_tokens: 50,
            response_format: { type: 'json_object' }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('Groq intent detection error:', error.message);
        return { intent: 'search', confidence: 1.0 };
    }
}

module.exports = {
    enhanceSearchQuery,
    compareProducts,
    detectIntent,
    isAvailable: () => groqClient !== null
};
