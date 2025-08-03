import React, { useState, useEffect } from 'react';
import { BsClipboard, BsCheckCircle, BsPlusCircle, BsX, BsCalendar, BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const HistoryCopyPage = () => {
  const [historyData, setHistoryData] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [newEntry, setNewEntry] = useState({ date: '', content: '' });
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;
  const [copiedHistory, setCopiedHistory] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    setHistoryData(data);
  }, []);

  const toggleDate = (date) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleCopy = () => {
    const newHistory = {};
    selectedDates.forEach(date => {
      if (historyData[date]) newHistory[date] = historyData[date];
    });
    setCopiedHistory(JSON.stringify(newHistory, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(copiedHistory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.content) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    
    try {
      // Parse the content as JSON to validate
      const contentObj = JSON.parse(newEntry.content);
      
      // Create updated history by merging new entry
      const updatedHistory = {
        ...historyData,
        [newEntry.date]: contentObj
      };
      
      // Save to localStorage
      localStorage.setItem('data', JSON.stringify(updatedHistory));
      
      // Update state
      setHistoryData(updatedHistory);
      
      // Show success and reset
      setAddSuccess(true);
      setNewEntry({ date: '', content: '' });
      
      // Close modal after delay
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess(false);
      }, 1500);
      
    } catch (e) {
      alert('خطأ في تنسيق JSON. يرجى المحاولة مرة أخرى.');
    }
  };

  const formatDate = (dateStr) => {
    const [d, m, y] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const sortedDates = Object.keys(historyData).sort((a, b) => {
    const [da, ma, ya] = a.split('-').map(Number);
    const [db, mb, yb] = b.split('-').map(Number);
    return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedDates.length / itemsPerPage);
  const paginatedDates = sortedDates.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleSelectAll = () => {
    if (selectedDates.length === sortedDates.length) {
      setSelectedDates([]);
    } else {
      setSelectedDates([...sortedDates]);
    }
  };

  return (
    <div className="min-h-screen bg- p-4 md:p-8 showSmoothy">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة سجل البيانات</h1>
          <p className="text-gray-600">نسخ أو إضافة سجل البيانات المخزن في المتصفح</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => setShowCopyModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center"
          >
            <BsClipboard className="text-3xl mb-3" />
            <span className="text-xl font-semibold">نسخ السجل</span>
            <p className="text-blue-100 mt-2 text-sm">نسخ بيانات تواريخ محددة</p>
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center"
          >
            <BsPlusCircle className="text-3xl mb-3" />
            <span className="text-xl font-semibold">إضافة سجل</span>
            <p className="text-green-100 mt-2 text-sm">إضافة بيانات جديدة دون حذف القديمة</p>
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-blue-800 font-semibold">عدد التواريخ المسجلة</p>
              <p className="text-2xl font-bold text-blue-600">{sortedDates.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">آخر تاريخ مضاف</p>
              <p className="text-lg font-bold text-green-600">
                {sortedDates.length > 0 ? formatDate(sortedDates[0]) : 'لا يوجد بيانات'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">أحدث التواريخ المسجلة</h2>
          <div className="space-y-3">
            {paginatedDates.map((date, index) => (
              <div key={date} className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <BsCalendar className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{formatDate(date)}</p>
                    <p className="text-sm text-gray-600">
                      {Object.keys(historyData[date] || {}).length} عنصر
                    </p>
                  </div>
                </div>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {date}
                </span>
              </div>
            ))}
          </div>
          
          {sortedDates.length > 0 && (
            <div className="flex justify-between items-center mt-4 pb-10">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  page === 0 ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <BsArrowLeft className="mr-1" /> السابق
              </button>
              
              <span className="text-sm text-gray-600">
                الصفحة {page + 1} من {totalPages}
              </span>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  page === totalPages - 1 ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                التالي <BsArrowRight className="ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Copy History Modal */}
        {showCopyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">نسخ بيانات السجل</h2>
                <button 
                  onClick={() => {
                    setShowCopyModal(false);
                    setSelectedDates([]);
                  }}
                  className="p-1 rounded-full hover:bg-indigo-700"
                >
                  <BsX className="text-xl" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-4">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    {selectedDates.length === sortedDates.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedDates.length} تواريخ محددة من أصل {sortedDates.length}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {paginatedDates.map(date => (
                    <div 
                      key={date}
                      onClick={() => toggleDate(date)}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${
                        selectedDates.includes(date) 
                          ? 'bg-indigo-50 border-indigo-500' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border mr-2 flex items-center justify-center ${
                          selectedDates.includes(date) 
                            ? 'bg-indigo-500 border-indigo-500' 
                            : 'border-gray-400'
                        }`}>
                          {selectedDates.includes(date) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{formatDate(date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {sortedDates.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <button 
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        page === 0 ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <BsArrowLeft className="mr-1" /> السابق
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      الصفحة {page + 1} من {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        page === totalPages - 1 ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      التالي <BsArrowRight className="ml-1" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="border-t p-4 bg-gray-50 flex justify-between">
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCopy}
                  disabled={selectedDates.length === 0}
                  className={`px-4 py-2 rounded-lg text-white flex items-center ${
                    selectedDates.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <BsClipboard className="ml-2" />
                  {copied ? 'تم النسخ!' : 'نسخ المحدد'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add History Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">إضافة بيانات جديدة</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-teal-700"
                >
                  <BsX className="text-xl" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">التاريخ (يوم-شهر-سنة)</label>
                  <input
                    type="text"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="01-01-2023"
                  />
                  <p className="text-sm text-gray-500 mt-1">استخدم التنسيق: يوم-شهر-سنة (مثال: 01-01-2023)</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">بيانات JSON</label>
                  <textarea
                    rows={8}
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder={`{\n  "key1": "value1",\n  "key2": "value2",\n  "key3": {\n    "nested": "value"\n  }\n}`}
                  />
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-bold text-blue-800 mb-2">مثال لبيانات JSON:</h3>
                  <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
{`{
  "مبيعات": 12000,
  "عملاء": 24,
  "منتجات": [
    "منتج 1",
    "منتج 2"
  ],
  "ملاحظات": "يوم ناجح"
}`}</pre>
                </div>
              </div>
              
              <div className="border-t p-4 bg-gray-50 flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntry.date || !newEntry.content}
                  className={`px-4 py-2 rounded-lg text-white flex items-center ${
                    !newEntry.date || !newEntry.content
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  <BsPlusCircle className="ml-2" />
                  {addSuccess ? 'تمت الإضافة!' : 'إضافة البيانات'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Indicator */}
        {copied && (
          <div className="fixed bottom-6 right-6 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            تم نسخ البيانات إلى الحافظة!
          </div>
        )}
        
        {addSuccess && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            تمت إضافة البيانات بنجاح!
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryCopyPage;