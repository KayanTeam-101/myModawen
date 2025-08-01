import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Record from "./pages/record/Record";
import History from "./pages/history/History";
import ChartPage from "./pages/chart/Chart";
import HistoryCopyPage from "./pages/copypage/Copyhistory";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Record />} />
        <Route path="/history" element={<History />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/HistoryCopyPage" element={<HistoryCopyPage />} />
      </Routes>
      <Navbar />
    </>
  );
}

export default App;
