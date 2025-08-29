import { useRef,useEffect } from "react";
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
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const THEME =localStorage.getItem('theme');
    if (metaTheme) {
    }
    if (THEME == "dark") {
     metaTheme.setAttribute('content', '#000');
    document.body.style.backgroundColor="#000";
   }else{
    document.body.style.backgroundColor="#fff";
     metaTheme.setAttribute('content', '#000');

   }


      if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          // إنشاء الإشعار
          notificationRef.current = new Notification("📌 التطبيق مفتوح", {
            body: "الإشعار سيظل موجود حتى تغلق الصفحة",
            requireInteraction: true, // يبقى ظاهر
            icon: "/logo192.png"
          });
        }
      });
    }

    // عند إغلاق الصفحة نمسح الإشعار
    const handleUnload = () => {
      if (notificationRef.current) {
        notificationRef.current.close();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);


  useEffect(() => {
    // طلب إذن المستخدم
 
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
