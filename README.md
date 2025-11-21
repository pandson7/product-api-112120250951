# Product API - AWS Serverless Solution

A complete AWS serverless solution for a Product API that exposes RESTful endpoints for accessing product specifications stored in DynamoDB.

## 🏗️ Architecture

This project implements a serverless architecture using:

- **AWS CDK** (TypeScript) for Infrastructure as Code
- **Amazon DynamoDB** for product data storage
- **AWS Lambda** for business logic
- **Amazon API Gateway** for REST API endpoints
- **Node.js 22.x** runtime

## 📋 Features

- ✅ RESTful API for product management
- ✅ Flexible JSON schema for product specifications
- ✅ Product filtering by category and brand
- ✅ Auto-scaling DynamoDB with GSIs
- ✅ CORS enabled for web applications
- ✅ Comprehensive error handling
- ✅ CloudWatch logging and monitoring
- ✅ Sample data seeding

## 🚀 API Endpoints

### Base URL
```
https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/
```

### GET /products
Retrieve all products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by product category
- `brand` (optional): Filter by product brand  
- `limit` (optional): Limit number of results (default: 50)

**Example:**
```bash
curl "https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/products?category=Electronics&limit=10"
```

**Response:**
```json
{
  "products": [
    {
      "productId": "prod-001",
      "name": "Wireless Headphones",
      "category": "Electronics",
      "brand": "TechBrand",
      "attributes": {
        "price": 199.99,
        "description": "High-quality wireless headphones with noise cancellation",
        "specifications": {
          "batteryLife": "30 hours",
          "connectivity": "Bluetooth 5.0",
          "weight": "250g"
        },
        "availability": true
      },
      "createdAt": "2024-11-21T19:59:45.123Z",
      "updatedAt": "2024-11-21T19:59:45.123Z"
    }
  ],
  "count": 1
}
```

### GET /products/{id}
Retrieve a specific product by ID.

**Example:**
```bash
curl "https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

## 📊 Data Schema

Products are stored with the following flexible JSON structure:

```json
{
  "productId": "string (required)",
  "name": "string (required)",
  "category": "string (required)",
  "brand": "string (required)",
  "attributes": {
    "price": "number",
    "description": "string",
    "specifications": "object (flexible)",
    "availability": "boolean"
  },
  "createdAt": "string (ISO timestamp)",
  "updatedAt": "string (ISO timestamp)"
}
```

## 🛠️ Infrastructure

### DynamoDB Table
- **Table Name**: Products112120250951
- **Primary Key**: productId (String)
- **Billing Mode**: Provisioned with auto-scaling (1-10 capacity units)
- **Global Secondary Indexes**:
  - CategoryIndex: Partition key on `category`
  - BrandIndex: Partition key on `brand`

### Lambda Functions
- **GetProducts112120250951**: Handles product listing and filtering
- **GetProductById112120250951**: Handles single product retrieval
- **SeedData112120250951**: Populates database with sample data

### API Gateway
- **Type**: REST API
- **CORS**: Enabled for all origins
- **Throttling**: Enabled for rate limiting

## 📦 Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)

### Deploy the Stack

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Bootstrap CDK (first time only):**
   ```bash
   cdk bootstrap
   ```

3. **Deploy the stack:**
   ```bash
   cdk deploy
   ```

4. **Seed sample data:**
   The deployment automatically triggers the seed function to populate sample data.

### Clean Up
```bash
cdk destroy
```

## 🧪 Testing

### Sample Products
The system comes pre-loaded with 5 sample products:

1. **Wireless Headphones** (Electronics, TechBrand)
2. **Smart Watch** (Electronics, FitTech)
3. **Running Shoes** (Sports, SportMax)
4. **Coffee Maker** (Home, BrewMaster)
5. **Laptop Backpack** (Accessories, TechBrand)

### Test Commands
```bash
# Get all products
curl "https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/products"

# Filter by category
curl "https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/products?category=Electronics"

# Filter by brand
curl "https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/products?brand=TechBrand"

# Get specific product
curl "https://yujnrdi512.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

## 📁 Project Structure

```
product-api-112120250951/
├── lib/
│   └── product-api-stack.ts          # CDK stack definition
├── src/
│   └── lambda/
│       ├── getProducts.js            # List products Lambda
│       ├── getProductById.js         # Get product by ID Lambda
│       ├── seedData.js               # Sample data
│       └── seedDataProvider.js       # Seed function Lambda
├── specs/                            # Project specifications
├── generated-diagrams/               # Architecture diagrams
├── pricing/                          # Cost analysis
├── cdk.json                          # CDK configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 💰 Cost Analysis

Detailed cost analysis available in the `pricing/` directory:
- **Estimated Monthly Cost**: ~$5-15 for low-medium traffic
- **Pay-per-use model** with DynamoDB and Lambda
- **Auto-scaling** to optimize costs

## 📈 Monitoring

- **CloudWatch Logs**: All Lambda functions log to CloudWatch
- **API Gateway Metrics**: Request count, latency, errors
- **DynamoDB Metrics**: Read/write capacity, throttling
- **Custom Dashboards**: Available in AWS Console

## 🔒 Security

- **IAM Roles**: Least privilege access for all resources
- **API Gateway**: Throttling and request validation
- **CORS**: Properly configured for web applications
- **Input Validation**: All API inputs are validated
- **Error Handling**: Secure error responses without sensitive data

## 🚀 Performance

- **Response Times**: < 500ms for typical requests
- **Auto-scaling**: DynamoDB and Lambda scale automatically
- **Efficient Queries**: GSIs for optimized filtering
- **Caching**: API Gateway response caching available

## 📚 Documentation

- **API Documentation**: Available in `specs/` directory
- **Architecture Diagrams**: Available in `generated-diagrams/` directory
- **Cost Analysis**: Available in `pricing/` directory
- **Jira Stories**: Available in `jira-stories-summary.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the documentation in the `specs/` directory
2. Review CloudWatch logs for debugging
3. Open an issue in this repository

## 🎯 Next Steps

Optional enhancements for production use:
- Add authentication/authorization (Cognito)
- Implement caching layer (ElastiCache)
- Add advanced search capabilities (OpenSearch)
- Set up CI/CD pipeline (CodePipeline)
- Add comprehensive monitoring dashboard
- Implement data backup and recovery
- Add API versioning
- Implement rate limiting per user
