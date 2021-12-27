import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';

// export a wrapped function: wrap handler with middy and use those funcs
// a very functional property of JS
export default handler => middy(handler)
  .use([
		httpJsonBodyParser(),
		httpEventNormalizer(),
		httpErrorHandler(),
	]);	// an array of paras