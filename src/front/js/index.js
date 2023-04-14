//import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
//ReactDOM.createRoot(<Layout />, document.querySelector("#app"));

ReactDOM.createRoot(document.querySelector("#app")).render(<Layout />);

