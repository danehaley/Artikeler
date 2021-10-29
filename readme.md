# CAB 432 React Express Example
This is a simple example of serving a React Application from within your Express Server, alongside your API. In this example we have two separate folders, client and server - they each house their respective files and logic. We assume at this point you're able to containerize an application yourself so we have left that as an exercise for you.

### Client
The client directory was created using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). We have modified the boilerplate application to add a `FavoriteAnimal` component that makes a simple api request to `/api/question` and displays the response. You can follow this and similar patterns for all of your API requests.

### Server
The server directory was created by following the Express [Hello World Example](https://expressjs.com/en/starter/hello-world.html) and static assets are served following the Express [Serving Static Files Example](https://expressjs.com/en/starter/static-files.html). There are comments in the `index.js` file explaining what's happening in there.

### Modifications


### Getting Started
``` bash
# Build your client application first
cd client
npm run build

# Start the server
cd ../server
node index.js

# Open your browser and navigate to localhost:3000
```
