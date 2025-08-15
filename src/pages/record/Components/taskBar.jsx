import React, { useState, useEffect } from 'react';
import Task from './task';

const TaskBar = () => {
  // State for managing data
  const [data, setData] = useState({});
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data')) || {};
    setData(savedData);
  }, []);

  // Get today's date key
  const today = new Date();
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  
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
    <div className="w-full h-fit space-y-1">
      {todayItems.length > 0 ? (
        todayItems.map((item) => (
          <Task
            key={item.timestamp}
            id={item.timestamp}
            dateKey={item.date}
            name={item.name}
            price={item.price}
            time={item.time}
            count={item.count}
            onPriceChange={handlePriceChange}
                onDelete={handleDelete} // Add this prop

          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          لا توجد عناصر مضافة اليوم
        </div>
      )}
    </div>
  );
};

export default TaskBar;