import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiCheckLine, RiDeleteBack2Line } from 'react-icons/ri';

const AddBalance = ({ onClose }) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // theme
  const THEME = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';
  const isDark = THEME === 'dark';

  useEffect(() => {
    setShowModal(true);
    return () => {};
  }, []);

  const handlePress = (num) => {
    if (num === '.' && value.includes('.')) return;
    if (value === '0' && num !== '.') {
      setValue(num);
    } else {
      setValue(prev => prev + num);
    }
  };
  
  const handleClear = () => setValue('');
  const handleBackspace = () => setValue(prev => prev.slice(0, -1));
  
  const handleSubmit = () => {
    if (!value || parseFloat(value) <= 0) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') localStorage.setItem('balance', value);
      setIsSubmitting(false);
      closeModal();
    }, 800);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose?.();
      window.location.reload();
    }, 300);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    const n = parseFloat(amount);
    if (isNaN(n)) return '0.00';
    return  new Intl.NumberFormat("en-US", { style: "currency", currency: "Egp",maximumSignificantDigits:3 }).format(
    amount,
  );
  };

  // themed classes & indigo accents
  const overlayBg = isDark ? 'bg-gray-900/70' : 'bg-indigo-100/70';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900';
  const headingText = isDark ? 'text-white' : 'text-gray-800';
  const subtitleText = isDark ? 'text-gray-300' : 'text-gray-500';
  const decorative1 = isDark ? 'bg-indigo-700/20' : 'bg-indigo-200/40';
  const decorative2 = isDark ? 'bg-indigo-600/20' : 'bg-indigo-200/30';
  const keyPrimaryBg = isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white text-gray-800';
  const keySecondaryBg = isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 text-gray-600';
  const confirmGradient = 'bg-gradient-to-r from-indigo-600 via-sky-400 to-purple-300';

  return (
    <div 
      className={`fixed inset-0 ${overlayBg} backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        ref={modalRef}
        className={`${cardBg} rounded-2xl shadow-xl w-full max-w-md overflow-hidden border transition-all duration-300 transform ${
          showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold ${headingText}`}>تعديل الرصيد </h2>
          <button 
            onClick={closeModal}
            className={`p-2 rounded-full hover:${isDark ? 'bg-gray-700/40' : 'bg-gray-100'} transition-colors`}
          >
            <RiCloseLine className={`${isDark ? 'text-gray-200' : 'text-gray-500'} text-xl`} />
          </button>
        </div>

        {/* Display */}
        <div className="py-7 px-5 relative ">
          <div className="relative z-10">
            <div className="flex justify-center items-baseline">
              <span className={`text-3xl font-bold mr-2 ${isDark ? 'text-gray-500' : 'text-indigo-500'}`}></span>
              <div className="text-5xl font-bold tracking-tight">
                <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(value)}</span>
              </div>
            </div>
            <p className={`text-center mt-3 ${subtitleText}`}>ادخل المبلغ المطلوب إضافته</p>
          </div>
          
          {/* Decorative elements */}
          <div className={`absolute top-4 right-4 w-8 h-8 rounded-full ${decorative1}`}></div>
          <div className={`absolute bottom-4 left-4 w-6 h-6 rounded-full ${decorative2}`}></div>
        </div>

        {/* Number Pad */}
        <div className={`grid grid-cols-3 gap-3 p-5 ${isDark ? 'bg-gray-900/20' : 'bg-gray-50'}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <KeyButton key={num} onClick={() => handlePress(num.toString())} primaryBg={keyPrimaryBg}>
              {num}
            </KeyButton>
          ))}
          <KeyButton onClick={handleClear} variant="secondary" primaryBg={keySecondaryBg}>
            <RiCloseLine className={`text-xl ${isDark ? 'text-gray-200' : 'text-gray-600'}`} />
          </KeyButton>
          <KeyButton onClick={() => handlePress('0')} primaryBg={keyPrimaryBg}>0</KeyButton>
          <KeyButton onClick={handleBackspace} variant="secondary" primaryBg={keySecondaryBg}>
            <RiDeleteBack2Line className={`text-xl ${isDark ? 'text-gray-200' : 'text-gray-600'}`} />
          </KeyButton>
        </div>

        {/* Decimal Button */}
        

        {/* Confirm Button */}
        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={!value || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              value && !isSubmitting
                ? `${confirmGradient} shadow-md`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                جاري الإضافة...
              </div>
            ) : (
              <>
                <RiCheckLine size={24} />
                تأكيد تعديل الرصيد
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const KeyButton = ({ children, onClick, variant = 'primary', primaryBg = '' }) => (
  <button
    onClick={onClick}
    className={`
      h-16 rounded-xl text-xl font-semibold transition-all
      focus:outline-none active:scale-95 border flex justify-center items-center
      ${primaryBg} ${variant === 'primary' ? 'hover:brightness-105 shadow-sm' : 'hover:bg-opacity-90'}
      border-gray-200
    `}
  >
    {children}
  </button>
);

export default AddBalance;
