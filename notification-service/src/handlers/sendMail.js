import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-2' });

async function sendMail(event, context) {
  const params = {
    Source: 'xuzishuo1996@126.com',
    Destination: {
      ToAddresses: ['xuzishuo1996@126.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hello from Codingly!',
        },
      },
      Subject: {
        Data: 'Test Mail',
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const handler = sendMail;
