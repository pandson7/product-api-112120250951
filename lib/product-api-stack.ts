import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class ProductApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, 'ProductsTable112120250951', {
      tableName: 'Products112120250951',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Add auto scaling
    productsTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    productsTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    // GSI for category
    productsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    // GSI for brand
    productsTable.addGlobalSecondaryIndex({
      indexName: 'BrandIndex',
      partitionKey: { name: 'brand', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    // Lambda function for getting products
    const getProductsFunction = new lambda.Function(this, 'GetProductsFunction112120250951', {
      functionName: 'GetProducts112120250951',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProducts.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Lambda function for getting product by ID
    const getProductByIdFunction = new lambda.Function(this, 'GetProductByIdFunction112120250951', {
      functionName: 'GetProductById112120250951',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProductById.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Lambda function for seeding data
    const seedDataFunction = new lambda.Function(this, 'SeedDataFunction112120250951', {
      functionName: 'SeedData112120250951',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'seedData.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      timeout: cdk.Duration.seconds(60),
      memorySize: 512,
    });

    // Grant permissions
    productsTable.grantReadData(getProductsFunction);
    productsTable.grantReadData(getProductByIdFunction);
    productsTable.grantWriteData(seedDataFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductApi112120250951', {
      restApiName: 'Product API 112120250951',
      description: 'API for product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Products resource
    const products = api.root.addResource('products');
    
    // GET /products
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsFunction), {
      requestParameters: {
        'method.request.querystring.category': false,
        'method.request.querystring.brand': false,
        'method.request.querystring.limit': false,
      },
    });

    // GET /products/{id}
    const productById = products.addResource('{id}');
    productById.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    // Note: Sample data can be seeded by manually invoking the SeedData function

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productsTable.tableName,
      description: 'DynamoDB Table Name',
    });
  }
}
