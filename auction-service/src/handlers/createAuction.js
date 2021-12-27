import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body; // httpJsonBodyParser() does JSON.parse(event.body)
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createAt: now.toISOString(),
  };

  try {
    // ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
    // await and promise are the JS ES6 properties
    await dynamodb.put({
      // first letters of properties have to be upper letters
      // process.env is how to get env variables in JS
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }


  return {
    statusCode: 201,
    body: JSON.stringify({auction}),
  };
}

export const handler = middy(createAuction)
.use(httpJsonBodyParser())
.use(httpEventNormalizer())
.use(httpErrorHandler());
