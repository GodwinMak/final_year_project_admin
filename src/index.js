import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import Provider from "./context";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { AuthContextProvider } from "./context/AuthContext";
import { AreaContextProvider } from "./context/AreaContext";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Provider>
          <AreaContextProvider>
            <App />
          </AreaContextProvider>
        </Provider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
