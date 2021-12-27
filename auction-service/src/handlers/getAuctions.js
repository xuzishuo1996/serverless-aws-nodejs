import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
// for validating json schema
import validator from '@middy/validator';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
	const { status } = event.queryStringParameters;	// ? part in URL
	let auctions;

	const params = {
		TableName: process.env.AUCTIONS_TABLE_NAME,
		IndexName: 'statusAndEndDate',
		KeyConditionExpression: '#status = :status',
		ExpressionAttributeValues: {
			':status': status,	// the status const from the query parameters
		},
		ExpressionAttributeNames: {
			'#status': 'status',
		},
	};

	try {
		// const result = await dynamodb.scan({
		// 	TableName: process.env.AUCTIONS_TABLE_NAME, // query parameter
		// }).promise();

		const result = await dynamodb.query(params).promise();

		auctions = result.Items;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}

	return {
		statusCode: 200,
		body: JSON.stringify({auctions}),
	};
}

export const handler = commonMiddleware(getAuctions)
	.use(
		validator({
			inputSchema: getAuctionsSchema,
			ajvOptions: {
				useDefaults: true,
				strict: false,
			},
		})
	);
