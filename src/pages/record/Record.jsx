import {React,useEffect} from "react";
import Moneypanel from "./Components/Moneypanel";
import TaskBar from "./Components/taskBar";

const Record = () => {

  return (
    <div className="p-2 showSmoothy   ">
      <Moneypanel />
      <TaskBar />
    </div>
  );
};

export default Record;
