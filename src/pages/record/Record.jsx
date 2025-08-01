import {React,useEffect} from "react";
import Moneypanel from "./Components/Moneypanel";
import TaskBar from "./Components/taskBar";

const Record = () => {
     useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', '#fff');
    }
  }, []);
  return (
    <div className="p-2">
      <Moneypanel />
      <TaskBar />
    </div>
  );
};

export default Record;
