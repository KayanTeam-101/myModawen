import React, { useState } from "react";
import { RiZoomInLine, RiCloseLine } from "react-icons/ri";
import { FaImage } from "react-icons/fa6";
import { BsClipboard2MinusFill } from "react-icons/bs";

const List = () => {
  const data = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("data")) || {} : {};

  // Sort newest → oldest
  const sortedDates = Object.keys(data).sort((a, b) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };
    return parseDate(b) - parseDate(a);
  });

  const [expandedDates, setExpandedDates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingImage, setViewingImage] = useState(null);

  // theme
  const THEME = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';
  const isDark = THEME === 'dark';

  // theme helpers
  const containerText = isDark ? 'text-gray-100' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-900 border-2 border-gray-800/50' : 'bg-white border-gray-100';
  const inputBg = isDark ? 'bg-gray-600/40 border-gray-600 placeholder-gray-400 text-gray-200' : 'bg-white border-indigo-100 text-gray-900';
  const subtleBg = isDark ? 'bg-gray-700/30' : 'bg-indigo-50';
  const accent = isDark ? 'text-indigo-300' : 'text-indigo-700';
  const accentLight = isDark ? 'text-indigo-400' : 'text-indigo-400';
  const borderAccent = isDark ? 'border border-gray-800/50' : 'border-indigo-100';

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const filteredDates = sortedDates.filter((date) => {
    if (!searchTerm.trim()) return true;
    return Array.isArray(data[date]) && data[date].some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const showImage = (imageData) => {
    setViewingImage(imageData);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto py-6 px-3 showSmoothy ${containerText}`}>
      {/* Image Preview Modal */}
      {viewingImage && (
        <div
          className={`fixed inset-0 ${isDark ? 'bg-black/80' : 'bg-indigo-950/90'} backdrop-blur-md z-50 flex items-center justify-center p-4`}
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={viewingImage.photo}
              alt={viewingImage.name}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              className={`absolute top-4 right-4 ${isDark ? 'bg-gray-700/60 hover:bg-gray-600/60' : 'bg-indigo-600/80 hover:bg-indigo-500'} text-white rounded-full p-2 transition`}
              onClick={(e) => {
                e.stopPropagation();
                setViewingImage(null);
              }}
            >
              <RiCloseLine className="text-xl" />
            </button>
            <div className="text-center mt-4">
              <div className={`font-semibold text-lg ${accent}`}>{viewingImage.name}</div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-indigo-400'}`}>-{viewingImage.price} ج.م</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="ابحث عن عنصر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full py-3 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${inputBg}`}
        />
        <div className="absolute right-3 top-3.5 text-black">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* History List */}
      {filteredDates.length > 0 ? (
        filteredDates.map((date) => {
          const filteredItems = (data[date] || []).filter(
            (item) =>
              !searchTerm.trim() ||
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const totalForDate = filteredItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

          return (
            <div
              key={date}
              onClick={() => toggleDate(date)}
              className={`${cardBg} mb-4 rounded-xl shadow-sm overflow-hidden transition hover:shadow-md  ${borderAccent} active:bg-gray-800`}
            >
              {/* Date header */}
              <button
                className="w-full py-4 px-5 flex justify-between items-center transition"
              >
                <div className="text-left">
                  <h2 className={`font-bold ${accent}`}>{date}</h2>
                  <p className={`text-xs ${accentLight} mt-1`}>
                    {filteredItems.length} {filteredItems.length === 1 ? "عنصر" : "عناصر"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-red-500">-{totalForDate.toFixed(2)} ج.م</span>
                  <svg
                    className={`w-5 h-5 ${isDark ? 'text-indigo-300' : 'text-indigo-500'} transform transition-transform ${
                      expandedDates[date] ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              {/* Items */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedDates[date] ? 'border-t' : ''} ${isDark ? 'border-gray-700' : 'border-indigo-100'}`}
                style={{
                  maxHeight: expandedDates[date] ? `${filteredItems.length * 100}px` : '0px',
                }}
              >
                <div className="py-2">
                  {filteredItems.map((item, index) => (
                    <div
                      key={`${date}-${index}`}
                      className={`py-3 px-5 flex items-center border-b last:border-0 transition ${isDark ? 'border-gray-700' : 'border-indigo-50'} hover:${isDark ? 'bg-gray-700/30' : 'bg-indigo-50/50'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`${isDark ? 'text-gray-100' : 'text-gray-800'} font-semibold`}>{item.name}</p>
                        <div className={`flex items-center mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-indigo-400'}`}>
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {item.time}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-medium whitespace-nowrap ${accent}`}>-{item.price} ج.م</span>

                        {item.photo && (
                          <div
                            className="relative cursor-pointer group"
                            onClick={(e) => {
                              e.stopPropagation();
                              showImage({
                                photo: item.photo,
                                name: item.name,
                                price: item.price,
                              });
                            }}
                          >
                            <FaImage className={`text-lg group-hover:${isDark ? 'text-indigo-200' : 'text-indigo-600'} transition`} />
                            <div className={`absolute -top-1 -right-1 ${isDark ? 'bg-indigo-500' : 'bg-indigo-500'} rounded-full w-3 h-3 flex items-center justify-center`}>
                              <RiZoomInLine className="text-white text-[8px]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className={`${cardBg} text-center py-12 rounded-xl shadow-md border ${borderAccent}`}>
          {sortedDates.length === 0 ? (
            <>
              <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <BsClipboard2MinusFill />
              </div>
              <h3 className={`text-lg font-medium ${accent}`}>لا توجد عناصر مسجلة</h3>
              <p className={`mt-1 ${accentLight}`}>ابدأ بإضافة مشترياتك اليومية</p>
            </>
          ) : (
            <>
              <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className={`text-lg font-medium ${accent}`}>لا توجد نتائج</h3>
              <p className={`mt-1 ${accentLight}`}>لم نعثر على أي عناصر تطابق بحثك</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default List;
