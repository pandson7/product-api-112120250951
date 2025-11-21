# Product API - AWS Architecture Diagrams

This directory contains AWS architecture diagrams for the Product API project, generated based on the technical design specifications.

## Generated Diagrams

### 1. Product API Architecture (`product-api-architecture.png`)
**Overview**: High-level serverless architecture diagram showing the core components and their relationships.

**Components**:
- **API Client**: External users/applications consuming the API
- **API Gateway**: REST API endpoint with regional deployment
- **Lambda Functions**: 
  - `getProducts`: Handles product listing with filtering capabilities
  - `getProductById`: Handles single product retrieval
- **DynamoDB**: 
  - Products Table: Main data storage
  - Category GSI: Global Secondary Index for category-based queries
  - Brand GSI: Global Secondary Index for brand-based queries
- **Monitoring**: CloudWatch for logs/metrics and X-Ray for tracing

### 2. Detailed Request Flow (`product-api-detailed-flow.png`)
**Overview**: Detailed diagram showing API endpoints, request routing, and data access patterns.

**Key Features**:
- **API Endpoints**: 
  - `GET /products`: List products with optional filtering
  - `GET /products/{id}`: Retrieve specific product by ID
- **Lambda Function Details**: Shows specific responsibilities and capabilities
- **Database Structure**: Illustrates table schema and indexing strategy
- **Security & Monitoring**: IAM roles, CloudWatch integration

### 3. Deployment Architecture (`product-api-deployment.png`)
**Overview**: Complete deployment view showing infrastructure components, client access patterns, and operational aspects.

**Highlights**:
- **Multi-Client Support**: Web, mobile, and API clients
- **Serverless Configuration**: Node.js 18.x runtime, memory/timeout settings
- **Database Configuration**: On-demand billing, point-in-time recovery
- **Security**: IAM roles with least privilege access
- **Observability**: Comprehensive monitoring with CloudWatch, logs, and X-Ray
- **Infrastructure as Code**: AWS CDK for deployment automation

## Architecture Principles

### Serverless Design
- **API Gateway**: Regional endpoint with CORS, throttling, and validation
- **Lambda Functions**: Stateless, auto-scaling compute layer
- **DynamoDB**: Managed NoSQL database with on-demand scaling

### Security Best Practices
- IAM roles with least privilege access
- Input validation at API Gateway level
- Secure error handling to prevent information disclosure

### Performance Optimization
- Global Secondary Indexes for efficient querying
- Lambda function optimization for cold start reduction
- API Gateway caching capabilities

### Monitoring & Observability
- CloudWatch metrics and alarms for performance monitoring
- CloudWatch Logs for debugging and audit trails
- X-Ray distributed tracing for request flow analysis

## API Endpoints

### GET /products
- **Purpose**: Retrieve all products with optional filtering
- **Query Parameters**: `category`, `brand`, `limit`
- **Response**: Array of product objects
- **Database Access**: Uses GSI for filtered queries

### GET /products/{id}
- **Purpose**: Retrieve specific product by ID
- **Path Parameters**: `id` (product identifier)
- **Response**: Single product object
- **Database Access**: Direct table query by primary key

## Data Model

### Product Schema
```json
{
  "productId": "string",
  "name": "string", 
  "category": "string",
  "brand": "string",
  "attributes": {
    "price": "number",
    "description": "string",
    "specifications": "object",
    "availability": "boolean"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DynamoDB Configuration
- **Primary Key**: `productId` (String)
- **Global Secondary Indexes**:
  - Category-Index: Partition key on `category`
  - Brand-Index: Partition key on `brand`
- **Billing Mode**: On-demand for cost optimization
- **Features**: Point-in-time recovery enabled

## Deployment Information

### Infrastructure as Code
- **Tool**: AWS CDK (Cloud Development Kit)
- **Language**: TypeScript/JavaScript
- **Environments**: Separate stacks for dev/prod
- **Automation**: CI/CD pipeline integration

### Runtime Configuration
- **Lambda Runtime**: Node.js 18.x
- **Memory Allocation**: 256MB
- **Timeout**: 30 seconds
- **Environment Variables**: DynamoDB table name configuration

## File Locations

All diagram files are located in the `generated-diagrams` subdirectory:
- `/Users/sadhupri/echo-architect-artifacts/product-api-112120250951/generated-diagrams/generated-diagrams/`

## Generated On
- **Date**: November 21, 2024
- **Time**: 14:58 EST
- **Source**: `/Users/sadhupri/echo-architect-artifacts/product-api-112120250951/specs/design.md`
