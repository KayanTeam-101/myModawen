import React from 'react';
import Task from './task';

const TaskBar = () => {
  // Get data from localStorage or use empty object if null
  const data = JSON.parse(localStorage.getItem('data')) || {};
  
  // Get today's date key in "D-M-YYYY" format
  const today = new Date();
  const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  
  // Flatten all items and filter only today's items
  const todayItems = Object.entries(data)
    .filter(([date]) => date === dateKey)
    .flatMap(([, items]) =>
      items.map((item, idx) => ({ ...item, date: dateKey, count: idx + 1 }))
    );

  return (
    <div className="w-full h-fit space-y-1">
      {todayItems.length > 0 ? (
        todayItems.map((item) => (
          <Task
            key={`${item.date}-${item.count}`}
            name={item.name}
            price={item.price}
            time={item.time}
            date={item.date}
            count={item.count}
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
