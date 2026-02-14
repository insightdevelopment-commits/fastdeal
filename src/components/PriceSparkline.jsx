import React from 'react';
import { motion } from 'framer-motion';

/**
 * Mini Sparkline Component
 * Shows price trend over last 30 days
 */
const PriceSparkline = ({ data = [], currentPrice }) => {
    // Generate sample price data if not provided (showing downward trend)
    const priceData = data.length > 0 ? data : Array.from({ length: 30 }, (_, i) => {
        const basePrice = currentPrice * 1.15; // Started 15% higher
        const drop = (basePrice - currentPrice) * (i / 29); // Linear drop
        return basePrice - drop + (Math.random() * 10 - 5); // Add noise
    });

    const max = Math.max(...priceData);
    const min = Math.min(...priceData);
    const range = max - min || 1;

    // Create SVG path
    const points = priceData.map((price, i) => {
        const x = (i / (priceData.length - 1)) * 100;
        const y = 100 - ((price - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    const isDropping = priceData[priceData.length - 1] < priceData[0];

    return (
        <div className="flex items-center gap-2">
            <svg
                viewBox="0 0 100 20"
                className="w-20 h-5"
                preserveAspectRatio="none"
            >
                <polyline
                    points={points}
                    fill="none"
                    stroke={isDropping ? "#00ffff" : "#ff00ff"}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.8"
                />
            </svg>
            <span className={`text-xs font-mono ${isDropping ? 'text-neonCyan' : 'text-neonMagenta'}`}>
                {isDropping ? '↓' : '↑'} {Math.abs(((priceData[priceData.length - 1] - priceData[0]) / priceData[0]) * 100).toFixed(1)}%
            </span>
        </div>
    );
};

export default PriceSparkline;
