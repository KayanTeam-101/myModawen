import { useRef, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Record from "./pages/record/Record";
import History from "./pages/history/History";
import ChartPage from "./pages/chart/Chart";
import HistoryCopyPage from "./pages/copypage/Copyhistory";
import CameraPage from "./pages/Camera/Camera";

function App() {
  const notificationRef = useRef(null);

  useEffect(() => {
    // === Theme setup ===
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const THEME = localStorage.getItem("theme");

    if (THEME === "dark") {
      document.body.style.backgroundColor = "#000";
      metaTheme?.setAttribute("content", "#000");
    } else {
      document.body.style.backgroundColor = "#fff";
      metaTheme?.setAttribute("content", "#fff");
    }

    // === Notification via Service Worker ===
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("✅ Service Worker Registered:", reg);

        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // Ask SW to show notification
            if (reg.active) {
              reg.active.postMessage({ type: "SHOW_NOTIFICATION" });
            } else {
              navigator.serviceWorker.ready.then((readyReg) => {
                readyReg.active?.postMessage({ type: "SHOW_NOTIFICATION" });
              });
            }
          }
        });
      });
    }

    // === Cleanup notifications when unloading (optional) ===
    const handleUnload = () => {
      if (notificationRef.current) {
        notificationRef.current.close();
      }
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Record />} />
        <Route path="/history" element={<History />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/HistoryCopyPage" element={<HistoryCopyPage />} />
        <Route path="/Camera" element={<CameraPage />} />
      </Routes>
      <Navbar />
    </>
  );
}

export default App;
