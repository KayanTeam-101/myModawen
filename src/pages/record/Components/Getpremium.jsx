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


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-scroll">
          <button 
            onClick={onClose}
            className="absolute top-3 left-3 text-black bg-gray-100 rounded-full p-1 hover:bg-opacity-30 transition-all z-30"
            aria-label="إغلاق"
          >
            <RiCloseLine size={24} />
          </button>
      <div className="relative top-60 bg-white min-h-screen flex  items-center flex-col rounded-2xl  max-w-md overflow-hidden shadow-2xl p-4 z-0">



       <img src={img} className='max-w-40 shadow-2xl rounded-2xl showSmoothy' />
<p className='relative top-5 font-black showSmoothy  text-black'>

مُدوّن هي منصة يمكنك تثبيتها علي هاتفك او حاسبوك عن طريق الضغط علي الثلاث نقاط الموجودة في اعلا المتصفح (علي اليمين أو الشمال) ثم الضغط علي (إضافة للشاشة الرئيسية) أو (تثبيت) , وتعمل علي مساعدتك علي تنظيم مصروفاتك بشكل منظم وسليم

شرح صفحات طريقة استخدام مُدوّن
<br />
<br />
1.الصفحة الرئيسية :
في اعلا الصفحة يوجد الرصيد المضاف ويمكنك تغيير قيمته بمجرد الضغط مرتين علي الرصيد او المبلغ الرقمي.
يتوسط الصفحة مستطيل يحتوي علي التاريخ و زر اضافة العناصر, صحفة اضافة العناصر (اسم العنصر:مطلوب, السعر:مطلوب, صورة:إختياري)
في آخر الصفحة توجد العناصر المضافة, يمكنك تغيير سعر العنصر عند الضغط علي السعر مرتين , إذا كانت هناك صورة مضافة فستظهر علامة صورة جانت العنصر عند الضغط عليها تظهر الصورة
. الضغط المُطول علي العنصر لحذفه
<br />
<br />
2.السجل
يمكنك متابعة مصروفاتك بحسب التاريخ مع تواجد الصورة و الوقت بالدقيقة و الثانية و المبلغ الذي تم إنفاقة في اليوم،
<br />
<br />
3. الجدول 
لمراقبة تطور إنفقاتك اليومية و تحليلها بدقة 
<br />
<br />
4. الاعدادات :
لمشاركة مصروفات الايام حيث تقوم بتحديد الايام التي تود ان تشاركها ثم الضغط علي مشاركة , النص الذي ارسلته يُعبر عن البيانات , يقوم الطرف الثاني بنسخ النص ثم وضعة في الحقل النصي الذي في نفس الصفحة (صفحة الاعدادات) المكتوب فوقها (لصق البيانات) ثم الضغط علي (حفظ)
</p>
<br />
<br />
<br />
<br />

      </div>
    </div>
  );
};

export default Getpremium;