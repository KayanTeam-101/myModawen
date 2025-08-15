import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiCheckLine, RiDeleteBack2Line } from 'react-icons/ri';

const AddBalance = ({ onClose }) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  
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
      localStorage.setItem('balance', value);
      setIsSubmitting(false);
      closeModal();
    }, 800);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 300);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(amount));
  };

  return (
    <div 
      className={`fixed inset-0 bg-indigo-100/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 transition-all duration-300 transform ${
          showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">تعديل الرصيد </h2>
          <button 
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RiCloseLine className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Display */}
        <div className="py-7 px-5 relative ">
          <div className="relative z-10">
            <div className="flex justify-center items-baseline">
              <span className="text-3xl font-bold text-indigo-500 mr-2">ج.م</span>
              <div className="text-5xl font-bold text-gray-800 tracking-tight">
                {formatCurrency(value)}
              </div>
            </div>
            <p className="text-center text-gray-500 mt-3">ادخل المبلغ المطلوب إضافته</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-200/40"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-indigo-200/40"></div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 p-5 bg-gray-50">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <KeyButton key={num} onClick={() => handlePress(num.toString())}>
              {num}
            </KeyButton>
          ))}
          <KeyButton onClick={handleClear} variant="secondary">
            <RiCloseLine className="text-xl text-gray-600" />
          </KeyButton>
          <KeyButton onClick={() => handlePress('0')}>0</KeyButton>
          <KeyButton onClick={handleBackspace} variant="secondary">
            <RiDeleteBack2Line className="text-xl text-gray-600" />
          </KeyButton>
        </div>

        {/* Decimal Button */}
        <div className="px-5 pb-3">
          <button
            onClick={() => handlePress('.')}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors active:scale-[0.98] border border-gray-200"
          >
            إضافة فاصلة عشرية
          </button>
        </div>

        {/* Confirm Button */}
        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={!value || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              value && !isSubmitting
                ? 'bg-gradient-to-r from-indigo-500 via-sky-600  to-pink-500 hover:from-blue-600 hover:to-indigo-600 shadow-md'
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

const KeyButton = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`
      h-16 rounded-xl text-xl font-semibold transition-all
      focus:outline-none active:scale-95 border border-gray-200 flex justify-center items-center
      ${variant === 'primary'
        ? 'bg-white text-gray-800 hover:bg-gray-50 shadow-sm'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
    `}
  >
    {children}
  </button>
);

export default AddBalance;