import React, { useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import { Utilities } from "../../../utilities/utilities.js";
import Addbalance from "./Addbalance.jsx";

const Moneypanel = () => {
  const tools = new Utilities();
  const today = new Date();
  const dayName = today.toLocaleString("ar", { weekday: "long" });
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  const [isClicked, setIsClicked] = useState(false);
  const [balance, setBalance] = useState(0);
  const [inWallet, setInWallet] = useState(0);

  // Initialize or load balance
  useEffect(() => {
    const saved = localStorage.getItem('balance');
    if (saved === null) {
      localStorage.setItem('balance', '0');
      setBalance(0);
    } else {
      setBalance(parseFloat(saved) || 0);
    }
  }, []);

  // Recalculate remaining balance for today's transactions
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    const todayItems = Array.isArray(data[dateKey]) ? data[dateKey] : [];

    const spentToday = todayItems.reduce((sum, { price }) => {
      const val = parseFloat(price);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    setInWallet(balance - spentToday);
  }, [balance, dateKey]);

  const handleClick = () => {
    tools.sound();
    setIsClicked(true);
  };

  const handleCloseAddBalance = () => {
    setIsClicked(false);
    const updated = parseFloat(localStorage.getItem('balance')) || 0;
    setBalance(updated);
  };

  return (
    <>
      {!balance ? (
        <div
          className="w-full h-36 flex items-center justify-center \
                     bg-gradient-to-r from-sky-400 to-blue-600 text-white \
                     rounded-4xl shadow-md cursor-pointer transition-all duration-200 hover:opacity-90 showSmoothy"
          onClick={handleClick}
        >
          <span className="text-lg font-semibold">ضع ميزانية</span>
          <BsCashCoin className="text-2xl ml-2" />
        </div>
      ) : (
        <div className="w-full h-14 flex items-center justify-between bg-white rounded-lg shadow-sm p-4 text-sm text-gray-600">
          <div className="flex gap-4" onDoubleClick={handleClick}>
            <span className="font-medium">
              الدخل: <span className="text-blue-600">{balance.toFixed(2)} ج.م</span>
            </span>
            <span className="font-medium">
              المتبقي اليوم: <span className={inWallet < 0 ? 'text-red-600' : 'text-green-600'}>
                {inWallet.toFixed(2)} ج.م
              </span>
            </span>
          </div>
          <div className="flex gap-1 text-gray-500">
            <span>{dayName}</span>
            <span>{dateKey}</span>
          </div>
        </div>
      )}

      {isClicked && <Addbalance onClose={handleCloseAddBalance} />}
    </>
  );
};

export default Moneypanel;
