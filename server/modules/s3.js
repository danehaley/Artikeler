import AWS from "aws-sdk";
import { config } from "dotenv";
config();

const bucketName = "n9951831-artikeler";

function s3Setup() {
  // S3 Bucket setup
  const bucketPromise = new AWS.S3({
    apiVersion: "2006-03-01",
  })
    .createBucket({ Bucket: bucketName })
    .promise();

  bucketPromise
    .then(function (data) {
      console.log("Successfully created " + bucketName);
    })
    .catch(function (err) {
      console.log(err, err.stack);
    });
}

function s3Add(data, s3Key) {
  const body = JSON.stringify({
    source: "S3 Bucket",
    ...data,
  });

  const objectParams = {
    Bucket: bucketName,
    Key: s3Key,
    Body: body,
  };

  const uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
    .putObject(objectParams)
    .promise();

  uploadPromise.then(function (data) {
    console.log("Successfully uploaded data to " + bucketName + "/" + s3Key);
  });
}

function s3Mod(query, data) {
  let newData;
  const bucketName = "n9951831-artikeler";
  let s3Key = `news-${query}`;
  const params = { Bucket: bucketName, Key: s3Key };

  new AWS.S3({ apiVersion: "2006-03-01" }).getObject(params, (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result.Body);
      newData = resultJSON;
    }
  });
  s3Add(query, newData);
}

export { s3Add, s3Setup, s3Mod };
