'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 300

// Main Lambda entry point
exports.handler = async (event) => {
  return await callFaceRecognition(event)
}

const callFaceRecognition = async function(event) {
  try {
    // Initialize the Amazon Rekognition client
    const rekognition = new AWS.Rekognition();
    
    const body = event.body;
    // Transform the blob to bytes
    const bytes = Buffer.from(body, 'base64');

    // Perform face detection
    const response = await rekognition.detectFaces({
      Image: {
        "Bytes": bytes
      },
      Attributes: ['EMOTIONS', 'SMILE', 'EYES_OPEN', 'AGE_RANGE' ]
    }).promise();

    // DEFAULT | ALL | AGE_RANGE | BEARD | EMOTIONS |
    // EYE_DIRECTION | EYEGLASSES | EYES_OPEN | GENDER | MOUTH_OPEN | 
    // MUSTACHE | FACE_OCCLUDED | SMILE | SUNGLASSES
    console.log('FaceDetails: ', response.FaceDetails.smile);

    return JSON.stringify(response.FaceDetails)

  } catch (error) {
    // Handle any errors and log them
    console.error(error);
    throw error;
  }
}