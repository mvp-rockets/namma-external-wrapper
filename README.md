- [1. Introduction](#1-introduction)
- [2. Installation](#2-installation)
- [3. How to use](#3-how-to-use)
- [4. Imp Notes](#4-imp-notes)

### 1. Introduction

A javascript-based wrapper for making API calls with the ability to add retries and ratelimits.

### 2. Installation

`npm i @mvp-rockets/namma-external-wrapper`

### 3. How to use

```
// A simple REST "Get" example with retries 2 and minTimeout 5000.

    const ExternalWrapper = require('@mvp-rockets/namma-external-wrapper');

    const externalWrapper = new ExternalWrapper({ retries: 2, minTimeout: 5000 });
	const resultFromWrapper = await externalWrapper.perform({
		url: 'http://localhost:3000/test'
	});

    console.log(resultFromWrapper) // Result.Ok("Your result")
    or
    console.log(resultFromWrapper) // Result.Error("Error in case of failure")
```

```
// A simple REST "Post" example with retries 2 and minTimeout 5000.

    const ExternalWrapper = require('@mvp-rockets/namma-external-wrapper');

    const { name } = req.body;
	const externalWrapper = new ExternalWrapper({ retries: 2, minTimeout: 5000 });
	const resultFromWrapper = await externalWrapper.perform({
		url: 'http://localhost:3000/test',
		method: 'post',
		data: {
			name
		}
	});
    console.log(resultFromWrapper) // Result.Ok("Your result")
    or
    console.log(resultFromWrapper) // Result.Error("Error in case of failure")
```

```
// A simple REST "Get" example with retries 2, minTimeout 5000 and rateLimit 1 request per perMilliseconds.
    const ExternalWrapper = require('@mvp-rockets/namma-external-wrapper');
    const externalWrapper = new ExternalWrapper(
		{ retries: 2, minTimeout: 5000 },
		{
			maxRequests: 1,
			perMilliseconds: 10000,
			maxRPS: 1
		}
	);
	const resultFromWrapper = await externalWrapper.perform({
		url: 'http://localhost:3000/test'
	});

```

### 4. Imp Notes

1. Internally the lib use axios to make rest call. You can use any REST methods call by passing accepted data for details: https://www.npmjs.com/package/axios

2. ExternalWrapper take two object when you are initializing object. new ExternalWrapper(retryObject,rateLimitObject)
   1. retryObject details : https://www.npmjs.com/package/async-retry
      1. retries: The maximum amount of times to retry the operation. Default is 5.
      2. factor: The exponential factor to use. Default is 2.
      3. minTimeout: The number of milliseconds before starting the first retry. Default is 1000.
      4. maxTimeout: The maximum number of milliseconds between two retries. Default is Infinity.
   2. rateLimitObject details: https://www.npmjs.com/package/axios-rate-limit
      1. maxRequests: The no of request : example 2
      2. perMilliseconds: no of request perMilliseconds example 1
      3. maxRPS: maxRPS is a shorthand for perMilliseconds: 1000, and it takes precedence.if specified both with maxRequests and perMilliseconds
