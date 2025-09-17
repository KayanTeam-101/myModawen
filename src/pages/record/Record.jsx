import React, { useState } from "react";
import Moneypanel from "./Components/Moneypanel";
import TaskBar from "./Components/taskBar";
import IdentifyStructure from "./Components/IdentifyStructure";

const Record = () => {
  const [isRegistered, setIsRegistered] = useState(
    Boolean(localStorage.getItem("Identify")) == true
  );

  return (
    <div className="p-2 showSmoothy">
      {!isRegistered && <IdentifyStructure />}
      {isRegistered && <Moneypanel />}
      <TaskBar />
    </div>
  );
};

export default Record;
