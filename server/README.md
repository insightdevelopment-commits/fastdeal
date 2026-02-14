# FastDeal Backend

High-performance Node.js backend for global e-commerce marketplace aggregation.

## Features

- 🌍 **Parallel Marketplace Scanning** - Simultaneous API calls to Amazon, eBay, and AliExpress
- 🔍 **Intelligence Engine** - Trust Ledger scoring and Price Arbitrage calculation
- 💰 **Price Tracking** - Historical price monitoring with trend prediction
- 🚀 **Sub-2s Response Time** - Optimized for speed with caching and rate limiting
- 📊 **Real-time Analytics** - True cost calculation including shipping and taxes

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- API Keys for marketplaces (optional for testing)

### Installation

```bash
cd server
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

Optional (for full functionality):
- `RAINFOREST_API_KEY` - Amazon data via Rainforest API
- `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` - eBay Buy API
- `ALIEXPRESS_APP_KEY` / `ALIEXPRESS_APP_SECRET` - AliExpress Open Platform

### Run Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Search Products

```http
POST /api/v1/search
Content-Type: application/json

{
  "query": "gaming laptop",
  "region": "US",
  "filters": {
    "minTrustScore": 0.6
  }
}
```

Response:
```json
{
  "results": [...],
  "scanTime": "1.18s",
  "marketplacesCovered": ["amazon", "ebay"],
  "totalFound": 45,
  "trustedCount": 30
}
```

### Get Price History

```http
GET /api/v1/tracking/:productId?days=30
```

### Create Order

```http
POST /api/v1/orders
Content-Type: application/json

{
  "productId": "abc123...",
  "quantity": 1,
  "userId": "user_xyz"
}
```

### Get User Orders

```http
GET /api/v1/orders/:userId
```

## Architecture

```
server/
├── config/          # Database & environment config
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── services/        # Business logic
│   ├── scraper/     # Marketplace integrations
│   ├── intelligence/# Trust & pricing algorithms
│   └── search/      # Meilisearch integration
├── middleware/      # Rate limiting, error handling
├── utils/           # Helpers & normalization
└── server.js        # Entry point
```

## Rate Limiting

- Search: 10 requests/minute per IP
- General API: 30 requests/minute per IP
- Uses Redis for distributed rate limiting (falls back to memory)

## Data Flow

1. **User Search** → Parallel API calls to marketplaces
2. **Normalization** → Convert to FastDeal Standard format
3. **Trust Filtering** → Score vendors, exclude low-trust
4. **Price Analysis** → Calculate true cost, find best deals
5. **Caching** → Store in MongoDB for price tracking
6. **Response** → Return top 10 verified results in <2s

## Testing

### Health Check

```bash
curl http://localhost:5000/health
```

### Test Search (without API keys)

The system will return cached results or gracefully handle missing API credentials.

```bash
curl -X POST http://localhost:5000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query":"laptop","region":"US"}'
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Configure MongoDB Atlas connection
3. Set up Redis for distributed rate limiting
4. Add marketplace API credentials
5. Deploy to your preferred platform (AWS, Heroku, Vercel, etc.)

## License

MIT
