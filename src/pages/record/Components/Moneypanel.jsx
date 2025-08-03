import React, { useState, useEffect } from "react";
import { RiWallet3Line, RiAddCircleLine, RiMoneyPoundCircleLine, RiArrowDownCircleLine } from "react-icons/ri";
import { Utilities } from "../../../utilities/utilities.js";
import Addbalance from "./Addbalance.jsx";

const Moneypanel = () => {
  const tools = new Utilities();
  const today = new Date();
  const dayName = today.toLocaleString("ar", { weekday: "long" });
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const arabicDate = today.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  // Format currency in Arabic style
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {!balance ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <RiMoneyPoundCircleLine className="text-indigo-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا يوجد رصيد</h3>
              <p className="text-gray-500 mb-6">أضف رصيدًا لبدء تتبع مصروفاتك</p>
              <button 
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RiAddCircleLine className="text-xl" />
                <span className="font-medium">إضافة رصيد</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Total Balance Card */}
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-5 text-white"
              onDoubleClick={handleClick}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">الرصيد المضاف </p>
                  <h2 className="text-3xl font-bold mt-1">{formatCurrency(balance)}</h2>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <RiWallet3Line className="text-xl" />
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs opacity-80">انقر مرتين لتعديل الرصيد</span>
              
              </div>
            </div>
            
            {/* Remaining Balance Card */}
            <div className={`bg-white rounded-2xl shadow-xl p-5 ${
              inWallet < 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">المبلغ المتبقي</p>
                  <h2 className={`text-2xl font-bold mt-1 ${
                    inWallet < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(inWallet)}
                  </h2>
                </div>
                <div className={`p-2 rounded-lg ${
                  inWallet < 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
             
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full wide ${
                      inWallet < 0 ? 'bg-red-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${Math.min(100, Math.max(0, (inWallet / balance) * 100))}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 ج.م</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date Information */}
          <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm text-gray-500">اليوم</p>
                <p className="font-medium">{dayName}</p>
              </div>
            </div>
            <div className="h-6 border-r border-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500">التاريخ</p>
              <p className="font-medium">{arabicDate}</p>
            </div>
            <button 
              onClick={handleClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
            >
              <RiAddCircleLine />
              <span>إضافة رصيد</span>
            </button>
          </div>
        </div>
      )}

      {isClicked && <Addbalance onClose={handleCloseAddBalance} />}
    </div>
  );
};

export default Moneypanel;