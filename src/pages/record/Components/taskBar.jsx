import React, { useState, useEffect } from 'react';
import Task from './task';
import { BsClipboard2MinusFill, BsPlus } from "react-icons/bs";
import AddItem from './Additem';

const TaskBar = () => {
  // State for managing data
  const [data, setData] = useState({});
    const [showAddItem, setShowAddItem] = useState(false);
      const [balance, setBalance] = useState(0);
    
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data')) || {};
    setData(savedData);
  }, []);

  // Get today's date key
  const today = new Date();
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
   useEffect(() => {
      const saved = localStorage.getItem('balance');
      if (saved === null) {
        localStorage.setItem('balance', '0');
        setBalance(0);
      } else {
        setBalance(parseFloat(saved) || 0);
      }
    }, []);

  // Handle price updates
  const handlePriceChange = (date, id, newPrice) => {
    setData(prev => {
      const newData = { ...prev };
      // Update the specific item
      newData[date] = newData[date].map(item => 
        item.timestamp === id ? { ...item, price: newPrice } : item
      );
      
      // Persist to localStorage
      localStorage.setItem('data', JSON.stringify(newData));
      return newData;
    });
    window.location.reload();
  };
  const THEME = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';
  const isDark = THEME === 'dark';


const handleDelete = (dateKey, id) => {
  setData(prev => {
    const newData = { ...prev };
    newData[dateKey] = newData[dateKey].filter(item => item.timestamp !== id);
    localStorage.setItem('data', JSON.stringify(newData));
    return newData;
  });
};
  // Filter today's items
  const todayItems = data[dateKey] 
    ? data[dateKey].map((item, idx) => ({ 
        ...item, 
        date: dateKey, 
        count: idx + 1 
      }))
    : [];

  return (
    <div className="w-full h-10/12 overflow-y-scroll">
      {todayItems.length > 0 ? (
        todayItems.map((item) => (
       <>   <Task
            key={item.timestamp}
            id={item.timestamp}
            dateKey={item.date}
            name={item.name}
            price={item.price}
            time={item.time}
            count={item.count}
            onPriceChange={handlePriceChange}
            onDelete={handleDelete} 
            photo={item.photo}
            record={item.record}

          />
           
          </>
        ))
      ) : (
        <div className="text-center py-28  flex justify-center items-center flex-col gap-10 text-gray-500 showSmoothy"    onClick={() => {
    const button = document.querySelector('div.bg-white button.bg-gradient-to-r');
    console.log(button);
    
    if (button) {
      button.click();
    }
  }}
>
          لا توجد عناصر مضافة اليوم
<BsClipboard2MinusFill size={150} className=' text-gray-200'/>
        </div>
      )}
  
    <button
                   onClick={() => {
                     setShowAddItem(true);
                   }}
                   className={`fixed bottom-20 left-7 min-w-12  p-2 min-h-12 flex justify-center items-center rounded-full ${isDark ? 'bg-indigo-950/40 backdrop-blur-lg text-white' : 'bg-indigo-500/15 text-indigo-700'}`}
                   aria-label="إضافة عنصر جديد"
                 >
                   <BsPlus  size={35} />
                   
                 </button>  
                       {showAddItem && (
        <AddItem onClose={() => {
          const updated = parseFloat(localStorage.getItem('balance')) || 0;
          setBalance(updated);
          setShowAddItem(false);
          window.location.reload();
        }} />
      )}
    </div>
  );
};

export default TaskBar;