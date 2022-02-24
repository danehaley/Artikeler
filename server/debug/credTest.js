require("dotenv").config();
let AWS = require("aws-sdk");

AWS.config.getCredentials(function (err) {
  // credentials not loaded
  if (err) console.log(err.stack);
  else {
    console.log("Access Key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});
