import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiCheckLine, RiDeleteBack2Line } from 'react-icons/ri';

const AddBalance = ({ onClose }) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [userLanguage, setUserLanguage] = useState('en-US'); // Default to English
  const modalRef = useRef(null);

  // Fix: Detect both theme and language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const THEME = localStorage.getItem('theme') || 'light';
      setIsDark(THEME === 'dark');
      
      // Detect user's language from browser/OS
      const browserLanguage = navigator.language || navigator.userLanguage || 'en-US';
      setUserLanguage(browserLanguage);
      
      setShowModal(true);
    }
  }, []);

  const handlePress = (num) => {
    if (num === '.' && value.includes('.')) return;
    if (value === '0' && num !== '.') {
      setValue(num);
    } else {
      value.length < 7 ? setValue(prev => prev + num) : null;
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
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 300);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    const n = parseFloat(amount);
    if (isNaN(n)) return '0.00';
    
    // Fix: Use detected user language instead of hardcoded Arabic
    try {
      return new Intl.NumberFormat(userLanguage, { 
        style: "currency", 
        currency: "EGP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }).format(n);
    } catch (error) {
      // Fallback formatting based on language
      if (userLanguage.startsWith('ar')) {
        return `${n.toFixed(2)} ج.م`; // Arabic fallback
      } else {
        return `EGP ${n.toFixed(2)}`; // English fallback
      }
    }
  };

  // Helper function to check if language is Arabic
  const isArabic = () => {
    return userLanguage.startsWith('ar');
  };

  // Fix: Use conditional classes instead of template literals for Tailwind
  const overlayBg = isDark ? 'bg-gray-900/70' : 'bg-indigo-100/70';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900';
  const headingText = isDark ? 'text-white' : 'text-gray-800';
  const subtitleText = isDark ? 'text-gray-300' : 'text-gray-500';
  const decorative1 = isDark ? 'bg-indigo-700/20' : 'bg-indigo-200/40';
  const decorative2 = isDark ? 'bg-indigo-600/20' : 'bg-indigo-200/30';
  const keyPrimaryBg = isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-800';
  const keySecondaryBg = isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-600';
  const confirmGradient = 'bg-gradient-to-r from-indigo-600 to-purple-500';

  // Fix: KeyButton component with proper styling
  const KeyButton = ({ children, onClick, variant = 'primary' }) => (
    <button
      onClick={onClick}
      disabled={value.length > 6}
      className={`
        h-16 rounded-xl text-xl font-semibold transition-all duration-200 
        focus:outline-none active:scale-95 border flex justify-center items-center
        ${variant === 'primary' ? keyPrimaryBg : keySecondaryBg}
        ${value.length > 6 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        border-gray-300
      `}
    >
      {children}
    </button>
  );

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
        dir={isArabic() ? "rtl" : "ltr"} // Set text direction based on language
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold ${headingText}`}>
            {isArabic() ? 'تعديل الرصيد' : 'Edit Balance'}
          </h2>
          <button 
            onClick={closeModal}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-gray-700/40' : 'hover:bg-gray-100'
            }`}
          >
            <RiCloseLine className={`text-xl ${isDark ? 'text-gray-200' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Display */}
        <div className="py-7 px-5 relative">
          <div className="relative z-10">
            <div className="flex justify-center items-baseline">
              <div className="text-5xl font-bold tracking-tight">
                <span className={isDark ? 'text-white' : 'text-gray-800'}>
                  {formatCurrency(value)}
                </span>
              </div>
            </div>
            <p className={`text-center mt-3 text-sm ${subtitleText}`}>
              {isArabic() ? 'ادخل المبلغ المطلوب إضافته' : 'Enter the amount you want to add'}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className={`absolute top-4 right-4 w-8 h-8 rounded-full ${decorative1}`}></div>
          <div className={`absolute bottom-4 left-4 w-6 h-6 rounded-full ${decorative2}`}></div>
        </div>

        {/* Number Pad */}
        <div className={`grid grid-cols-3 gap-3 p-5 ${isDark ? 'bg-gray-900/20' : 'bg-gray-50'}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <KeyButton key={num} onClick={() => handlePress(num.toString())}>
              {num}
            </KeyButton>
          ))}
          
          <KeyButton variant="secondary" onClick={handleClear}>
            <RiCloseLine className="text-xl" />
          </KeyButton>
          
          <KeyButton onClick={() => handlePress('0')}>
            0
          </KeyButton>
          
          <KeyButton variant="secondary" onClick={handleBackspace}>
            <RiDeleteBack2Line className="text-xl" />
          </KeyButton>
        </div>

        {/* Decimal Button */}
        <div className="px-5 pb-3">
          <KeyButton onClick={() => handlePress('.')}>
            .
          </KeyButton>
        </div>

        {/* Confirm Button */}
        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={!value || parseFloat(value) <= 0 || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              value && parseFloat(value) > 0 && !isSubmitting
                ? `${confirmGradient} shadow-md hover:shadow-lg active:scale-95`
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin ml-2"></div>
                {isArabic() ? 'جاري الإضافة...' : 'Adding...'}
              </div>
            ) : (
              <>
                <RiCheckLine size={20} />
                {isArabic() ? 'تأكيد تعديل الرصيد' : 'Confirm Balance Update'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBalance;