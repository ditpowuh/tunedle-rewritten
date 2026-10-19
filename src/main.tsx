import * as ReactDOM from "react-dom/client";
import {StrictMode} from "react";

import "@fontsource-variable/noto-sans";
import "./globals.css";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);
