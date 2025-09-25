import React, { useState, useEffect } from "react";
import { RiWallet3Line, RiAddCircleLine, RiMoneyPoundCircleLine, RiInfoI, RiStickyNoteAddFill } from "react-icons/ri";
import { Utilities } from "../../../utilities/utilities.js";
import premiumImage from '/premium.jpg';
import Addbalance from "./Addbalance.jsx";
import Additem from "./Additem.jsx";
import Getpremium from "./Getpremium.jsx";
import { BsInfo, BsPlus  } from "react-icons/bs";
import ShoppingList from "./ShoppingList.jsx";

// Moneypanel with conditional Tailwind classes for light / dark theme
// Usage: the component reads localStorage.getItem('theme') and applies classes
// based on THEME === 'dark'. If no theme is stored, it falls back to 'light'.

const Moneypanel = () => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [balance, setBalance] = useState(0);
  const [inWallet, setInWallet] = useState(0);

  // read theme from localStorage (client-side). default to 'light' if missing
  const THEME = (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light';
  const isDark = THEME === 'dark';

  const tools = new Utilities();
  const today = new Date();
  const dayName = today.toLocaleString("ar", { weekday: "long" });
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const arabicDate = today.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
let format = e =>{
  return 
}
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



  // helper classes
  const containerBase = `max-w-4xl mx-auto px-4`;
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const cardBg = '';
  const cardShadow = isDark ? 'shadow-md' : 'shadow-';
  const subtleBg = isDark ? 'bg-indigo-900/15' : 'bg-indigo-50';
  const infoText = isDark ? 'text-gray-300' : 'text-gray-500';
  const smallText = isDark ? 'text-white' : 'text-gray-500';
  // main accent now consistently indigo
  const accentText = 'text-indigo-600';
  const buttonGradient = 'bg-gradient-to-r from-indigo-600 via-sky-400 to-purple-300';

  return (
    <div className={`${containerBase} ${textMain}`}>
      {!balance ? (
        <div className="flex flex-col items-center justify-center py-4 ">
          <div className={`${cardBg} ${cardShadow} rounded-2xl p-6 w-full max-w-md`}
               style={{ backdropFilter: isDark ? 'blur(6px)' : 'none' }}>
            <div className="flex flex-col items-center text-center">
              <div className={`${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} w-20 h-20 rounded-full flex items-center justify-center mb-4`}>
                <RiMoneyPoundCircleLine className={`${accentText} text-4xl`} />
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>لا يوجد رصيد</h3>
              <p className={`${infoText} mb-6`}>اضف قيم رقمة حسب الاموال التي معك</p>
              <button
                onClick={() => {
                  handleSound();
                  setShowAddBalance(true);
                }}
                className={`w-full ${buttonGradient} text-white py-3 rounded-xl ${isDark ? 'shadow-lg' : 'shadow-lg'} hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2`}
              >
                <RiAddCircleLine className="text-xl" />
                <span className="font-medium">إضافة رصيد</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1  gap-4">
            {/* Total Balance Card */}
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-4`}
              onDoubleClick={() => setShowAddBalance(true)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-lg  font-black opacity-80 ${smallText}`}>الرصيد</p>
                  <h2 className={`text-3xl font-black mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span className={`${inWallet > 0 ? (isDark ? 'text-white' : 'text-black') : 'text-red-600'}`}>{  new Intl.NumberFormat("en-US", { style: "currency", currency: "Egp",maximumSignificantDigits:6 }).format(
    inWallet)} </span>
                    <span className="p-1 text-gray-600"></span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-300'} pl-2`}>متبقي من {  new Intl.NumberFormat("en-US", { style: "currency", currency: "Egp",maximumSignificantDigits:6 }).format(
    balance)} <span className="pl-1 text-gray-600"></span></span>
                  </h2>
                </div>
                <button
                  className={`p-1.5 font-black rounded-full text-white ${isDark ? 'bg-gray-500/40' : 'bg-black'} animate-pulse flex items-center justify-center`}
                  onClick={() => {
                    handleSound();
                    setShowPremiumModal(true);
                  }}
                  aria-label="عرض مميزات بريميوم"
                >
                تعلم  
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-xs opacity-50 ${smallText}`}>انقر مرتين لتعديل الرصيد</span>
              </div>
            </div>

          </div>

          {/* Date Information */}
          <div
            className={`rounded-full h-20 select-none active:opacity-80 transition-all p-4 flex justify-between items-center `}
            onDoubleClick={() => setShowAddItem(true)}
          >
            <div className="flex items-center gap-2">
              <div>
                <p className={`text-sm ${smallText}`}>اليوم</p>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{dayName}</p>
              </div>
            </div>
            <div className={`h-6 border-r ${isDark ? 'border-gray-600' : 'border-gray-200'}`}></div>
            <div>
              <p className={`text-sm ${smallText}`}>التاريخ</p>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{arabicDate}</p>
            </div>

       
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
      {showList && (
      <ShoppingList onClose={() => setShowList(false)}/>

      )}
    </div>
  );
};

export default Moneypanel;
