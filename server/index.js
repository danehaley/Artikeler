import path from "path";
import express from "express";
import { router } from "./routes/news.js";
import { s3Setup } from "./modules/s3.js";

const app = express();
const port = 4000;

// Serve out any static assets correctly
app.use(express.static('../client/build'));

app.get('/', (req, res) => {
  const str =  'XXXX';
  res.writeHead(200,{'content-type': 'text/html'});
  res.write(str);
  res.end();
});

// New api routes should be added here.
// It's important for them to be before the `app.use()` call below as that will match all routes.

// Any routes that don't match on our static assets or api should be sent to the React Application
// This allows for the use of things like React Router

app.use('/news', router); 

app.use('/setup', s3Setup);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})