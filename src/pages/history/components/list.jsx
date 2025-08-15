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
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Filter dates and items based on search term
  const filteredDates = sortedDates.filter(date => {
    // If search is empty, show all dates
    if (!searchTerm.trim()) return true;
    
    // Check if any item in this date matches the search
    return data[date].some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 showSmoothy">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="ابحث عن عنصر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:border-transparent"
        />
        <div className="absolute right-3 top-3.5 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredDates.length > 0 ? (
        filteredDates.map(date => {
          // Filter items within each date
          const filteredItems = data[date].filter(item => 
            !searchTerm.trim() || 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return (
            <div 
              key={date} 
              className="mb-3 bg-white rounded-lg overflow-hidden border border-gray-100 active:bg-gray-50 transition-colors"
            >
              {/* Date header */}
              <button
                onClick={() => toggleDate(date)}
                className="w-full py-4 px-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="text-left">
                    <div className="flex items-center">
                      <h2 className="font-extrabold">{date}</h2>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredItems.length} {filteredItems.length === 1 ? 'عنصر' : 'عناصر'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="font-medium text-red-500 p-1">
                    -{filteredItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)} ج.م
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedDates[date] ? 'rotate-90' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              {/* Items container */}
              <div
                className={`transition-all duration-300 border-none ease-in-out overflow-hidden ${
                  expandedDates[date] ? 'border-t border-gray-100' : ''
                }`}
                style={{
                  maxHeight: expandedDates[date] ? `${filteredItems.length * 100}px` : '0px'
                }}
              >
                <div className="py-2">
                  {filteredItems.map((item, index) => (
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
                          <span className="text-gray-500">{item.time}</span>
                        </div>
                      </div>
                      
                      <span className="text-gray-500 font-semibold whitespace-nowrap">-{item.price} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          {sortedDates.length === 0 ? (
            // No items at all
            <>
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">لا توجد عناصر مسجلة</h3>
              <p className="mt-1 text-gray-500">ابدأ بإضافة مشترياتك اليومية</p>
            </>
          ) : (
            // No search results
            <>
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">لا توجد نتائج</h3>
              <p className="mt-1 text-gray-500">لم نعثر على أي عناصر تطابق بحثك</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default List;