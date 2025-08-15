import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { registerSW } from 'virtual:pwa-register';
import { Analytics } from '@vercel/analytics/react';

// const updateSW = registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// });

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Analytics />
  </BrowserRouter>,
);
