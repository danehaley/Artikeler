// React imports
import React, { useEffect, useState } from "react";

// Components Imports
import Results from "./components/results.js";

// CSS Imports
import "./App.css";
import Trending from "./components/trending.js";

function App() {
  const [query, setQuery] = useState([]);

  // Debugging for re-renders
  console.log("App render");

  return (
    <div className="App">
      <body>
        <section class="submit">
          <img id="logo" src={require("./img/logo.png")}></img>
          <div class="container">
            <Trending state={query} setState={setQuery} />
            <Results state={query} setState={setQuery} />
          </div>
        </section>
      </body>
    </div>
  );
}
export default App;
