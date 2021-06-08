// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const patientId = event.pathParameters.id;

  deletePatient(patientId)
    .then(() => {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({ data: "success" }),
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

function deletePatient(patientId) {
  return ddb
    .delete({
      TableName: "patients",
      Key: {
        patient_id: patientId,
      },
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
