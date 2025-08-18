import React, { useState } from 'react';
import { RiCloseLine, RiVipCrownFill } from 'react-icons/ri';
import { Utilities } from '../../../utilities/utilities.js';

const Getpremium = ({ onClose }) => {
  const tools = new Utilities();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const premiumFeatures = [
    "إحصائيات مفصلة عن مصروفاتك",
    "نسخ احتياطي تلقائي للسحابة",
    "إشعارات وتنبيهات للمصروفات",
    "دعم فني مخصص",
    "إمكانية إضافة حسابات متعددة",
    "واجهة بدون إعلانات"
  ];

  const validatePhone = () => {
    if (!phone) {
      setError("يرجى إدخال رقم الهاتف");
      return false;
    }
    
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone.startsWith('01') || cleanedPhone.length !== 11) {
      setError("رقم فودافون كاش غير صحيح (يجب أن يكون 11 رقم ويبدأ بـ 01)");
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    tools.sound();
    
    if (!validatePhone()) return;
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-5 relative">
          <button 
            onClick={onClose}
            className="absolute top-3 left-3 text-white bg-black bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all"
            aria-label="إغلاق"
          >
            <RiCloseLine size={24} />
          </button>
          
          <div className="flex flex-col items-center text-center text-white">
            <RiVipCrownFill className="text-4xl mb-2" />
            <h2 className="text-2xl font-bold">ترقية إلى حساب بريميوم</h2>
            <p className="opacity-90 mt-1">استمتع بمزايا حصرية وتجربة أفضل</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {!isSuccess ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">المزايا المميزة:</h3>
                <ul className="space-y-2">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-medium">سعر الاشتراك:</span>
                  <span className="bg-yellow-500 text-white py-1 px-3 rounded-full font-bold">
                    10 ج.م / شهر
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  سيتم تجديد الاشتراك تلقائيًا كل شهر حتى إلغاء الاشتراك
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم فودافون كاش
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">+20</span>
                    </div>
                  </div>
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جارِ المعالجة...
                    </>
                  ) : (
                    "دفع عن طريق فودافون كاش"
                  )}
                </button>
                
                <div className="mt-3 text-center text-sm text-gray-500">
                  سيصلك كود تفعيل على هذا الرقم لتأكيد الدفع
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تم الترقية بنجاح!</h3>
              <p className="text-gray-600">
                تم تفعيل حسابك البريميوم بنجاح. استمتع بالمزايا الحصرية!
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <div className="w-12 h-8 bg-contain bg-center bg-no-repeat bg-[url('https://www.vodafone.com.eg/assets/images/icons/payment/vodafone-cash-logo.svg')] mr-2"></div>
            <span>مدفوعات آمنة عبر فودافون كاش</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Getpremium;