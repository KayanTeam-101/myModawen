import React, { useState, useEffect } from 'react';
import { BsClipboard, BsCheckCircle } from 'react-icons/bs';

const HistoryCopyPage = () => {
  const [historyData, setHistoryData] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [customHistory, setCustomHistory] = useState('');

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
    setCustomHistory(JSON.stringify(newHistory, null, 2));
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(customHistory);
      localStorage.setItem('data', JSON.stringify(parsed));
      alert('تم حفظ التعديلات بنجاح');
    } catch {
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
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">نسخ وتحرير السجل</h1>

      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">اختر الأيام</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          {sortedDates.map(date => (
            <label key={date} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedDates.includes(date)}
                onChange={() => toggleDate(date)}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">{formatDate(date)}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <BsClipboard className="inline-block mr-2" /> نسخ
        </button>
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">التعديل</h2>
        <textarea
          rows={10}
          value={customHistory}
          onChange={(e) => setCustomHistory(e.target.value)}
          className="w-full p-2 border rounded-md font-mono text-sm"
        />
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <BsCheckCircle className="inline-block mr-2" /> حفظ
        </button>
      </section>
    </div>
  );
};

export default HistoryCopyPage;
