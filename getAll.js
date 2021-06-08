// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  getPromptuaries()
    .then((promptuaries) => {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify(promptuaries),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    })
    .catch((err) => {
      console.error(err);

      errorResponse(err.message, context.awsRequestId, callback);
    });
};

function getPromptuaries() {
  return ddb
    .scan({
      TableName: "patients",
    })
    .promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
