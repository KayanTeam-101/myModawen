import React, { useState, useEffect } from "react";
import { RiWallet3Line, RiAddCircleLine, RiMoneyPoundCircleLine } from "react-icons/ri";
import { Utilities } from "../../../utilities/utilities.js";
import premiumImage from '/premium.jpg';
import Addbalance from "./Addbalance.jsx";
import Additem from "./Additem.jsx";
import Getpremium from "./Getpremium.jsx";
import { BsPlusCircle } from "react-icons/bs";

const Moneypanel = () => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
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

  // Recalculate remaining balance
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    const todayItems = Array.isArray(data[dateKey]) ? data[dateKey] : [];

    const spentToday = todayItems.reduce((sum, { price }) => {
      const val = parseFloat(price);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    setInWallet(balance - spentToday);
  }, [balance, dateKey]);

  const handleSound = () => tools.sound();

  const formatCurrency = (amount) => {
    return amount  + ' EGP';
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
                onClick={() => {
                  handleSound();
                  setShowAddBalance(true);
                }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Balance Card */}
            <div
              className="rounded-2xl  text-gray-900  "
              onDoubleClick={() => setShowAddBalance(true)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">الرصيد المضاف </p>
                  <h2 className="text-3xl font-bold mt-1">{formatCurrency(balance)}</h2>
                </div>
                <button
                  className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-blue-300 p-2 rounded-lg"
                  onClick={() => {
                    handleSound();
                    setShowPremiumModal(true);
                  }}
                  aria-label="عرض مميزات بريميوم"
                >
                  <img src={premiumImage} width={26} alt="Premium" />
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs opacity-50">انقر مرتين لتعديل الرصيد</span>
              </div>
            </div>

            {/* Remaining Balance Card */}
            <div className="bg-white rounded-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">المبلغ المتبقي</p>
                  <h2 className={`text-2xl font-bold mt-1 ${inWallet < 0 ? 'text-red-600' : 'text-indigo-600'}`}>
                    {formatCurrency(inWallet)}
                  </h2>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${inWallet < 0 ? 'bg-red-500' : 'bg-indigo-400'}`}
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
          <div 
            className="bg-white rounded-2xl select-none active:opacity-20  p-4 flex justify-between items-center border border-gray-100"
            onDoubleClick={() => setShowAddItem(true)}
          >
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
                onClick={() => {
                  handleSound();
                  setShowAddItem(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-2 rounded-full"
                aria-label="إضافة عنصر جديد"
              >
                <BsPlusCircle size={25}/>
              </button>
            </div>
          </div>
        )}
      
      {/* Modals */}
      {showAddBalance && (
        <Addbalance onClose={() => {
          const updated = parseFloat(localStorage.getItem('balance')) || 0;
          setBalance(updated);
          setShowAddBalance(false);
        }} />
      )}
      
      {showAddItem && (
        <Additem onClose={() => {
          const updated = parseFloat(localStorage.getItem('balance')) || 0;
          setBalance(updated);
          setShowAddItem(false);
        }} />
      )}
      
      {showPremiumModal && (
        <Getpremium onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  );
};

export default Moneypanel;