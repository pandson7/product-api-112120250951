const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const { category, brand, limit = '50' } = event.queryStringParameters || {};
    const tableName = process.env.TABLE_NAME;
    
    let command;
    let params = {
      TableName: tableName,
      Limit: parseInt(limit),
    };

    if (category && brand) {
      // Filter by both category and brand - use scan with filter
      params.FilterExpression = 'category = :category AND brand = :brand';
      params.ExpressionAttributeValues = {
        ':category': category,
        ':brand': brand,
      };
      command = new ScanCommand(params);
    } else if (category) {
      // Query by category using GSI
      params.IndexName = 'CategoryIndex';
      params.KeyConditionExpression = 'category = :category';
      params.ExpressionAttributeValues = {
        ':category': category,
      };
      command = new QueryCommand(params);
    } else if (brand) {
      // Query by brand using GSI
      params.IndexName = 'BrandIndex';
      params.KeyConditionExpression = 'brand = :brand';
      params.ExpressionAttributeValues = {
        ':brand': brand,
      };
      command = new QueryCommand(params);
    } else {
      // Scan all products
      command = new ScanCommand(params);
    }

    const result = await docClient.send(command);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key',
      },
      body: JSON.stringify({
        products: result.Items || [],
        count: result.Items?.length || 0,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      }),
    };
  }
};
