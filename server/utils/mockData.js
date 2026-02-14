/**
 * Mock Search Data
 * Used for development/testing when marketplace APIs are not available
 */

const mockProducts = [
    {
        id: 'mock-1',
        title: 'iPhone 17 Pro - Titanium Black',
        description: '6.3-inch ProMotion display, A19 Bionic chip, 256GB storage, titanium frame',
        price: 999.99,
        vendor: 'Apple Store Official',
        marketplace: 'amazon',
        imageUrl: '/iphones/Apple_iPhone_17_Pro_Max_512Gb_Black_Titanium_chernyj_titan.png',
        url: 'https://amazon.com/dp/example1',
        shipping: { cost: { usd: 0 }, estimatedDays: 2 },
        reviews: { avgRating: 4.9, count: 2850 }
    },
    {
        id: 'mock-2',
        title: 'iPhone 17 Pro Max - Desert Gold',
        description: '6.7-inch Super Retina XDR, A19 chip, 512GB, advanced camera system',
        price: 1199.00,
        vendor: 'TechDeals Premium',
        marketplace: 'ebay',
        imageUrl: '/iphones/orig.png',
        url: 'https://ebay.com/itm/example2',
        shipping: { cost: { usd: 0 }, estimatedDays: 1 },
        reviews: { avgRating: 4.8, count: 1920 }
    },
    {
        id: 'mock-3',
        title: 'iPhone 17 Air - Mist Blue',
        description: '6.1-inch display, ultra-thin aluminum chassis, 128GB, lightweight design',
        price: 799.00,
        vendor: 'GlobalTech Store',
        marketplace: 'aliexpress',
        imageUrl: '/iphones/17_Blue-702x702.jpg',
        url: 'https://aliexpress.com/item/example3',
        shipping: { cost: { usd: 5.99 }, estimatedDays: 12 },
        reviews: { avgRating: 4.6, count: 1450 }
    },
    {
        id: 'mock-4',
        title: 'iPhone 17 - Coral Orange',
        description: '6.1-inch Liquid Retina, A18 chip, dual camera, vibrant color options',
        price: 899.00,
        vendor: 'BestBuy Official',
        marketplace: 'amazon',
        imageUrl: '/iphones/7930704511.jpg',
        url: 'https://amazon.com/dp/example4',
        shipping: { cost: { usd: 0 }, estimatedDays: 3 },
        reviews: { avgRating: 4.7, count: 3100 }
    },
    {
        id: 'mock-5',
        title: 'iPhone 17 Pro - Natural Titanium',
        description: '6.3-inch ProMotion, A19 Bionic, 512GB, professional photography features',
        price: 1099.00,
        vendor: 'Premium Electronics',
        marketplace: 'ebay',
        imageUrl: '/iphones/orig.jpg',
        url: 'https://ebay.com/itm/example5',
        shipping: { cost: { usd: 0 }, estimatedDays: 2 },
        reviews: { avgRating: 4.9, count: 2200 }
    },
    {
        id: 'mock-6',
        title: 'iPhone 17 Plus - Midnight Purple',
        description: '6.5-inch display, extended battery life, A18 chip, premium finish',
        price: 949.00,
        vendor: 'TechWorld Direct',
        marketplace: 'amazon',
        imageUrl: '/iphones/b3e102fea4e711f0844400155db5ff28_16b962d8a4e811f0844400155db5ff28-420x450.jpg',
        url: 'https://amazon.com/dp/example6',
        shipping: { cost: { usd: 0 }, estimatedDays: 4 },
        reviews: { avgRating: 4.7, count: 1680 }
    }
];

/**
 * Generate mock search results based on query
 */
function generateMockResults(query, region = 'US') {
    // Simulate search delay
    const scanTime = (Math.random() * 0.8 + 0.4).toFixed(2);

    // Filter/modify results based on query
    const results = mockProducts.map(product => ({
        ...product,
        title: product.title.includes('iPhone') ?
            product.title.replace('iPhone', query.includes('iPhone') ? 'iPhone' : query.split(' ')[0]) :
            product.title
    }));

    return {
        results,
        scanTime: `${scanTime}s`,
        marketplacesCovered: ['amazon', 'ebay', 'aliexpress'],
        totalFound: results.length,
        trustedCount: results.length
    };
}

module.exports = {
    mockProducts,
    generateMockResults
};
