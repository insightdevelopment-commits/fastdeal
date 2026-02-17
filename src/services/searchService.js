/**
 * Search Service
 * Handles all search-related API calls to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Search for products across all marketplaces
 * @param {string} query - Search query
 * @param {string} region - Region code (US, EU, ASIA)
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} - Search results
 */
export async function searchProducts(query, region = 'US', filters = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                region,
                filters
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Search failed with status ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            results: data.results || [],
            scanTime: data.scanTime,
            marketplacesCovered: data.marketplacesCovered || [],
            totalFound: data.totalFound || 0,
            trustedCount: data.trustedCount || 0
        };

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            return {
                success: false,
                error: 'Search timed out. Please try again.',
                results: []
            };
        }

        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
            results: []
        };
    }
}

/**
 * Get search suggestions based on partial query
 * @param {string} query - Partial search query
 * @returns {Promise<Object>} - Suggestions
 */
export async function getSearchSuggestions(query) {
    if (!query || query.length < 2) {
        return { suggestions: [] };
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/search/suggestions?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            return { suggestions: [] };
        }

        const data = await response.json();
        return {
            suggestions: data.suggestions || []
        };

    } catch (error) {
        console.error('Suggestions error:', error);
        return { suggestions: [] };
    }
}

export default {
    searchProducts,
    getSearchSuggestions
};
