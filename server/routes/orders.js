const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

/**
 * POST /api/v1/orders
 * Create a new order
 */
router.post('/', async (req, res) => {
    try {
        const { productId, quantity = 1, userId } = req.body;

        if (!productId || !userId) {
            return res.status(400).json({
                error: 'productId and userId are required'
            });
        }

        // Fetch product details from cache
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('product_hash', productId)
            .single();

        if (productError || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productData = product.normalized_data;

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                product_hash: productId,
                quantity,
                product_data: {
                    title: productData.title,
                    price: productData.trueCost?.total || productData.price.usd,
                    marketplace: productData.metadata.marketplace,
                    imageUrl: productData.metadata.imageUrl,
                    externalUrl: productData.metadata.url
                },
                status: 'pending',
                payment: {
                    amount: (productData.trueCost?.total || productData.price.usd) * quantity,
                    currency: 'USD',
                    method: 'pending'
                }
            })
            .select()
            .single();

        if (orderError) {
            throw orderError;
        }

        res.status(201).json({
            orderId: order.id,
            status: order.status,
            productTitle: order.product_data.title,
            totalAmount: order.payment.amount,
            externalUrl: productData.metadata.url,
            message: 'Order created successfully. Complete purchase on marketplace site.'
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

/**
 * GET /api/v1/orders/:userId
 * Get all orders for a user
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, limit = 20 } = req.query;

        let query = supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(parseInt(limit));

        if (status) {
            query = query.eq('status', status);
        }

        const { data: orders, error } = await query;

        if (error) {
            throw error;
        }

        res.json({
            orders: orders.map(order => ({
                orderId: order.id,
                product: order.product_data,
                quantity: order.quantity,
                status: order.status,
                tracking: order.tracking,
                payment: order.payment,
                createdAt: order.created_at
            })),
            total: orders.length
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

/**
 * PATCH /api/v1/orders/:orderId/tracking
 * Update order tracking information
 */
router.patch('/:orderId/tracking', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { trackingNumber, carrier, estimatedDelivery } = req.body;

        const { data: order, error } = await supabase
            .from('orders')
            .update({
                tracking: {
                    trackingNumber,
                    carrier,
                    trackingUrl: generateTrackingUrl(carrier, trackingNumber),
                    estimatedDelivery
                },
                status: 'shipped'
            })
            .eq('id', orderId)
            .select()
            .single();

        if (error || !order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            orderId: order.id,
            status: order.status,
            tracking: order.tracking
        });

    } catch (error) {
        console.error('Update tracking error:', error);
        res.status(500).json({ error: 'Failed to update tracking' });
    }
});

/**
 * Helper: Generate tracking URL based on carrier
 */
function generateTrackingUrl(carrier, trackingNumber) {
    const carriers = {
        'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
        'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
        'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
    };

    return carriers[carrier] || '';
}

module.exports = router;
