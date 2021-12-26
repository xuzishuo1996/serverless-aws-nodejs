import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createAt: now.toISOString(),
  };

  // ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
  // await and promise are the JS ES6 properties
  await dynamodb.put({
    // first letters of properties have to be upper letters
    // process.env is how to get env variables in JS
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({auction}),
  };
}

export const handler = createAuction;


