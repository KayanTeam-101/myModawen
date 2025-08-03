import React, { useState } from 'react';

const List = () => {
  const data = JSON.parse(localStorage.getItem('data')) || {};
  
  // Sort dates from newest to oldest
  const sortedDates = Object.keys(data).sort((a, b) => {
    const parseDate = dateStr => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    return parseDate(b) - parseDate(a);
  });

  const [expandedDates, setExpandedDates] = useState({});

  const toggleDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 showSmoothy">
      {sortedDates.length > 0 ? (
        sortedDates.map(date => (
          <div 
            key={date} 
            className="mb-3 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
          >
            {/* Date header */}
            <button
              onClick={() => toggleDate(date)}
              className="w-full py-4 px-4 flex justify-between items-center active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="text-left">
                  <div className="flex items-center">
                    <h2 className="font-extrabold     ">{date}</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {data[date].length} {data[date].length === 1 ? 'عنصر' : 'عناصر'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className=" font-medium text-gray-500 mr-2">
                  -{data[date].reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)} ج.م
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedDates[date] ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            {/* Items container */}
            <div
              className={`transition-all duration-300 border-none ease-in-out overflow-hidden  ${
                expandedDates[date] ? 'border-t border-gray-100' : ''
              }`}
              style={{
                maxHeight: expandedDates[date] ? `${data[date].length * 100}px` : '0px'
              }}
            >
              <div className="py-2">
                {data[date].map((item, index) => (
                  <div 
                    key={`${date}-${index}`} 
                    className="py-3 px-4 flex items-center border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <div className="flex items-center mt-1">
                        <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className=" text-gray-500">{item.time}</span>
                      </div>
                    </div>
                    
                    <span className="text-gray-500 font-semibold whitespace-nowrap">-{item.price} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">لا توجد عناصر مسجلة</h3>
          <p className="mt-1 text-gray-500">ابدأ بإضافة مشترياتك اليومية</p>
        </div>
      )}
    </div>
  );
};

export default List;