import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';
import createError from 'http-errors';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';

export async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);

  // Validate auction ownership
  if (auction.seller !== email) {
    throw new createError.Forbidden(`You are not the seller of this auction`);
  }

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64'); // have to add format 'base64', or store white pic

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({updatedAuction}),
  };
}

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler());