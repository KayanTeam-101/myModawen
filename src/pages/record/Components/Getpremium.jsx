import React, { useState, useEffect } from "react";
import { RiWallet3Line, RiAddCircleLine, RiMoneyPoundCircleLine } from "react-icons/ri";
import { Utilities } from "../../../utilities/utilities.js";
import premiumImage from '/premium.jpg';
import Addbalance from "./Addbalance.jsx";
import Getpremium from "./Getpremium.jsx";

const Moneypanel = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [balance, setBalance] = useState(0);
  const [inWallet, setInWallet] = useState(0);

  const tools = new Utilities();
  const today = new Date();
  const dayName = today.toLocaleString("ar", { weekday: "long" });
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const arabicDate = today.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Premium Modal */}
      {showPremium && <Getpremium onClose={() => setShowPremium(false)} />}
      
      {!balance ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <RiMoneyPoundCircleLine className="text-indigo-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا يوجد رصيد</h3>
              <p className="text-gray-600 mb-6">أضف رصيدًا لبدء تتبع مصروفاتك</p>
              <button 
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-gray-800 to-slate-700 text-white py-3 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
              >
                <RiAddCircleLine className="text-xl" />
                <span className="font-medium">إضافة رصيد</span>
              </button>
              
              <div 
                className="mt-6 flex items-center gap-2 p-3 border border-amber-200 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                onClick={() => setShowPremium(true)}
              >
                <img src={premiumImage} width={26} alt="Premium" className="rounded-full" />
                <span className="text-sm text-amber-700 font-medium">جرب النسخة المميزة</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Balance Card */}
            <div 
              className="bg-gradient-to-r from-slate-800 to-gray-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
              onDoubleClick={handleClick}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/5"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-300">الرصيد المضاف</p>
                    <h2 className="text-3xl font-bold mt-2">{formatCurrency(balance)}</h2>
                  </div>
                  <div 
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => setShowPremium(true)}
                  >
                    <img src={premiumImage} width={20} alt="Premium" className="rounded-full" />
                    <span className="text-xs font-medium text-amber-300">المزايا الكاملة</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xs text-gray-400">انقر مرتين لتعديل الرصيد</span>
                  <RiWallet3Line className="text-gray-300 text-xl" />
                </div>
              </div>
            </div>
            
            {/* Remaining Balance Card */}
            <div className={`bg-white rounded-2xl shadow-lg border-l-4 p-6 ${
              inWallet < 0 ? 'border-red-500' : 'border-green-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">المبلغ المتبقي</p>
                  <h2 className={`text-2xl font-bold mt-2 ${
                    inWallet < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(inWallet)}
                  </h2>
                </div>
                <div className={`p-3 rounded-lg ${
                  inWallet < 0 ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    inWallet < 0 ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                </div>
              </div>
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 ${
                      inWallet < 0 ? 'bg-red-500' : 'bg-green-500'
                    }`} 
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (inWallet / balance) * 100))}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0 ج.م</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">اليوم</p>
                <p className="font-medium text-gray-800">{dayName}</p>
              </div>
              <div className="h-6 border-r border-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500">التاريخ</p>
                <p className="font-medium text-gray-800">{arabicDate}</p>
              </div>
            </div>
            <button 
              onClick={handleClick}
              className="bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-900 transition-colors shadow-sm"
            >
              <RiAddCircleLine className="text-base" />
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