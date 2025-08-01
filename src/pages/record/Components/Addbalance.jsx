import React, { useState,useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { BsCheck } from 'react-icons/bs';

const AddBalance = ({ onClose }) => {
  const [value, setValue] = useState('');

  const handlePress = (num) => setValue(prev => prev + num);
  const handleClear = () => setValue('');
  const handleBackspace = () => setValue(prev => prev.slice(0, -1));

  const handlebmit = () => {
    localStorage.setItem('balance',value)
    window.location.reload()
  };

    useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', '#555');
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 showSmoothy">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">إضافة ميزانية</h2>
       
        </div>

        {/* Display */}
        <div className="py-6 px-4">
          <div className="relative">
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500">$</span>
            <input
              type="text"
              value={value || '0'}
              readOnly
              className="w-full text-center text-5xl font-bold bg-transparent border-none outline-none pr-8"
            />
          </div>
          <p className="text-center text-gray-500 mt-2">ادخل المبلغ</p>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <KeyButton key={num} onClick={() => handlePress(num.toString())}>
              {num}
            </KeyButton>
          ))}
          <KeyButton onClick={handleClear} variant="secondary">مسح</KeyButton>
          <KeyButton onClick={() => handlePress('0')}>0</KeyButton>
          <KeyButton onClick={handleBackspace} variant="secondary">⌫</KeyButton>
        </div>

        {/* Confirm */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handlebmit}
            disabled={!value}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all
              ${value
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <BsCheck size={24} />
              تأكيد
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const KeyButton = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`
      h-16 rounded-xl text-xl font-semibold transition-all
      active:scale-95 focus:outline-none
      ${variant === 'primary'
        ? 'bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-200 shadow-sm'
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-400'}
    `}
  >
    {children}
  </button>
);

export default AddBalance;
