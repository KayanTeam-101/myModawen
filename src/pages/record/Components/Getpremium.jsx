import React, { useState } from 'react';
import { RiCloseLine, RiVipCrownFill } from 'react-icons/ri';
import { Utilities } from '../../../utilities/utilities.js';
import img from '/mylogo.jpg'
const Getpremium = ({ onClose }) => {
  const tools = new Utilities();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  


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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <button 
            onClick={onClose}
            className="absolute top-3 left-3 text-black bg-gray-100 rounded-full p-1 hover:bg-opacity-30 transition-all"
            aria-label="إغلاق"
          >
            <RiCloseLine size={24} />
          </button>
      <div className="bg-white min-h-3/4 flex  items-center flex-col rounded-2xl  max-w-md overflow-hidden shadow-2xl p-4">


       <img src={img} className='max-w-40 shadow-2xl rounded-2xl showSmoothy' />
<p className='relative top-5 font-black showSmoothy'>
مُدوّن هو تطبيق يساعدك على تسجيل وتنظيم مشترياتك وطلباتك اليومية بسهولة. يوفّر لك صفحة جدول مبسطة لترتيب العناصر بشكل واضح، وصفحة سجل تتيح لك البحث والوصول بسرعة إلى مشترياتك السابقة، ليصبح تتبع نفقاتك اليومية أسهل من أي وقت مضى.
</p>

      </div>
    </div>
  );
};

export default Getpremium;