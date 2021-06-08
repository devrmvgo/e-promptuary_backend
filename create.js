// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const randomBytes = require("crypto").randomBytes;

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const patientId = toUrlString(randomBytes(16));
  const { patient } = JSON.parse(event.body);

  recordPromptuary(patientId, patient)
    .then(() => {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          PatientId: patientId,
          Patient: patient,
        }),
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

function recordPromptuary(patientId, patient) {
  return ddb
    .put({
      TableName: "patients",
      Item: {
        patient_id: patientId,
        patient_data: patient,
        RequestTime: new Date().toISOString(),
      },
    })
    .promise();
}

function toUrlString(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
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
