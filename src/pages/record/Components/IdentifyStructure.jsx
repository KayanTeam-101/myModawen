import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiUser, FiChevronLeft, FiX, FiMoon, FiSun } from 'react-icons/fi';

const IdentifyStructure = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [notificationsRequested, setNotificationsRequested] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const typingTimeoutRef = useRef(null);

  const steps = [
    {
      title: "مرحباً بك في مُدوّن 👋",
      description: "هُنا حيث يمكنك جدولة وفهم معاملاتك المالية أياً كانت كبيرة أو صغير بدون إضافة أي بطاقات ائتمان  لكن بدلاً من ذلك يمكنك وضع قيم رقمية ",
      illustration: (
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-pink-400 via-sky-300/40 to-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/15">
            <div className="w-32 h-32 bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-24 h-24 bg-blue-600 rounded-full opacity-40 mix-blend-lighten"></div>
        </div>
      ),
      buttonText: "التالي"
    },
    {
      title: "إية دا ؟!",
      description: "مُدون يعمل كــدفتر لتدوين المصروفات , لمعرفة في ماذا أنفقت اموالك و متي ,مع جدولة المصروفات بدقة",
      illustration: (
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-teal-300 rounded-full flex items-center justify-center shadow-xl shadow-teal-500/20">
            <div className="w-32 h-32 bg-white rounded-full flex justify-center items-center text-7xl text-teal-500">؟</div>
          </div>
          <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-blue-500 rounded-full opacity-40 mix-blend-lighten"></div>
        </div>
      ),
      buttonText: "التالي"
    },
    {
      title: "ابدأ إستعمالة إزاي 🤔",
      description: "بعد استكمال هذة الصفحة , سيظهر لك مستطيل مكتوب بداخله (إضافة رصيد) بعد الضغط عليه يمكنك اضافة المزانية, بعدها سيظهر مستطيل آخر يحتوي علي التاريخ و علامة الزائد , عند النقر علي علامة الزائد يمكنك اضافة عنصر مع كتابة سعر العنصر(الشئ المُشتَري)",
      illustration: (
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-300 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
            <div className="w-32 h-32 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-blue-400 rounded-full opacity-40 mix-blend-lighten"></div>
        </div>
      ),
      buttonText: "التالي"
    },
    {
      title: "سهل التصفح و الاستخدام",
      description: "واجهة مستخدم سهلة و أنيقة !",
      illustration: (
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-teal-300 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
            <div className="w-32 h-32 bg-teal-100 rounded-full opacity-40 animate-pulse"></div>
          </div>
          <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-blue-400 rounded-full opacity-40 mix-blend-lighten"></div>
        </div>
      ),
      buttonText: "التالي"
    },
    {
      title: "للإستخدام  الشخصي أو للأعمال التجارية",
      description: " يمكنك تدوين مشترياتك مثل ( شراء أغراض من السوبر ماركت, موصلات, إلخ..) أو (شراء 5 بكتات كُتب , شرات 3 شاشات 42 بوصة, شراء 5 طن حديد)   ",
      illustration: (
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-32 h-32 bg-cyan-300 rounded-full opacity-40 animate-pulse"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-24 h-24 bg-amber-400 rounded-full opacity-40 mix-blend-lighten"></div>
        </div>
      ),
      buttonText: "التالي"
    }
  ];

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Check if notifications are already granted
  useEffect(() => {
    if (Notification.permission === 'granted') {
      setNotificationsGranted(true);
    }
  }, []);

  // Typewriter effect for current step description
  useEffect(() => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Reset displayed text and start typing animation
    setDisplayedText('');
    setIsTyping(true);
    
    const currentDescription = steps[currentStep].description;
    let index = 0;

    const typeText = () => {
      if (index < currentDescription.length) {
        setDisplayedText(currentDescription.substring(0, index + 1));
        index++;
        typingTimeoutRef.current = setTimeout(typeText, 30); // Adjust typing speed here
      } else {
        setIsTyping(false);
      }
    };

    // Start typing after a short delay
    typingTimeoutRef.current = setTimeout(typeText, 300);

    // Cleanup function
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentStep]);

  // Validate Arabic input
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[\u0600-\u06FF\s]+$/.test(value)) {
      setName(value);
    }
  };

  const requestNotificationPermission = async () => {
    setNotificationsRequested(true);
    try {
      if (!('Notification' in window)) {
        alert('هذا المتصفح لا يدعم الإشعارات');
        setNotificationsGranted(false);
        setNotificationsRequested(false);
        return;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationsGranted(true);
        new Notification('مرحباً في مُدون!', {
          body: 'تم تفعيل الإشعارات بنجاح. سنخطرك بتذكيرات المصروفات المهمة.',
          icon: '/favicon.ico',
          dir: 'rtl'
        });
      } else {
        setNotificationsGranted(false);
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      setNotificationsGranted(false);
    } finally {
      setNotificationsRequested(false);
    }
  };

  const handleNext = () => {
    setIsDisabled(true);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipNotifications = () => {
    setCurrentStep(4);
  };

  const handleGetStarted = () => {
    if (name.trim()) {
      localStorage.setItem('Identify', name);
      setShowOnboarding(false);
      window.location.reload();
    } else {
      alert('الرجاء إدخال اسمك قبل المتابعة');
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
      case 1:
      case 2:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative transition-all duration-500 ease-in-out w-full max-w-md">
              <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-blue-500/5">
                <div className="bg-white rounded-2xl h-full p-6 flex flex-col items-center relative overflow-hidden">
                  <div className="my-8 transform transition-all duration-700 hover:scale-105">
                    {steps[currentStep].illustration}
                  </div>
                  
                  <h2 className="text-gray-800 text-2xl font-black text-center mb-4">
                    {steps[currentStep].title}
                  </h2>
                  
                  <p className="text-gray-900 text-sm font-black text-center mb-8 px-4 leading-relaxed min-h-[120px] flex items-center justify-center animate-pulse">
                    {displayedText}
                  </p>
                  
                  <div className="flex gap-3 w-full mt-auto">
                    {currentStep > 0 && (
                      <button 
                        onClick={handlePrevious}
                        className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <FiChevronLeft className="text-lg transform rotate-180" />
                        السابق
                      </button>
                    )}
                    <button 
                      onClick={handleNext}
                      disabled={isDisabled}
                      className={`py-4 ${
                        isDisabled 
                          ? 'bg-gradient-to-r from-gray-300 to-slate-100 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 via-sky-400 to-purple-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                      } text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                        isDisabled ? '' : 'transform hover:-translate-y-1'
                      } ${currentStep > 0 ? 'flex-1' : 'w-full'}`}
                    >
                      {steps[currentStep].buttonText}
                      <FiChevronLeft className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative transition-all duration-500 ease-in-out w-full max-w-md">
              <div className="rounded-3xl p-5 shadow-2xl shadow-blue-500/5 border border-gray-300">
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl h-full p-6 flex flex-col items-center relative overflow-hidden">
                  <h2 className="text-gray-800 text-2xl font-bold text-center mb-4 mt-4">
                    تفعيل الإشعارات
                  </h2>
                  
                  <p className="text-gray-600 text-sm text-center mb-8 px-4 leading-relaxed">
                    لتلقي تذكيرات مهمة حول مصروفاتك وجدولة الميزانية، يرجى تفعيل الإشعارات. يمكنك دائمًا تعديل هذا الإعداد لاحقًا في إعدادات المتصفح.
                  </p>
                  
                  <div className="w-48 h-48 bg-gray-100 rounded-2xl mb-8 overflow-hidden flex items-center justify-center border border-gray-300 shadow-inner cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={requestNotificationPermission}>
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiBell className="text-6xl mb-4" />
                      <p className="text-sm">Notification Access</p>
                    </div>
                  </div>
                  
                  <div className="w-full mb-4">
                    <button 
                      onClick={requestNotificationPermission}
                      disabled={notificationsRequested || notificationsGranted}
                      className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                        notificationsGranted
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                          : notificationsRequested
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                      }`}
                    >
                      {notificationsGranted 
                        ? 'تم تفعيل الإشعارات' 
                        : notificationsRequested 
                        ? 'جاري الطلب...' 
                        : 'تفعيل الإشعارات'
                      }
                      <FiBell />
                    </button>
                  </div>
                  
                  <div className="w-full mb-4">
                    <button 
                      onClick={handleSkipNotifications}
                      className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      تخطي
                    </button>
                  </div>
                  
                  <div className="flex gap-3 w-full mt-auto">
                    <button 
                      onClick={handlePrevious}
                      className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <FiChevronLeft className="text-lg transform rotate-180" />
                      السابق
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      التالي
                      <FiChevronLeft className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative transition-all duration-500 ease-in-out w-full max-w-md">
              <div className="rounded-3xl p-5 shadow-2xl shadow-blue-500/5 border border-gray-300">
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl h-full p-6 flex flex-col items-center relative overflow-hidden">
                  <h2 className="text-gray-600 font-bold text-center mb-4 mt-4">
                    متبقي خطوات آخيرة
                  </h2>
                  
                  <div className="w-full mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">اسمك (اللغة العريبة فقط)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <FiUser className="text-lg" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="bg-white border border-gray-300 text-gray-800 rounded-xl pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        placeholder="أدخل اسمك"
                        dir="rtl"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full mb-8">
                    <label className="text-gray-600 text-sm mb-2 block">المظهر</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 text-white shadow-inner' 
                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {theme === 'dark' && <FiMoon className="text-blue-500" />}
                        ليلي
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                          theme === 'light' 
                            ? 'bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 text-gray-800 shadow-inner' 
                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {theme === 'light' && <FiSun className="text-blue-500" />}
                        نهاري
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full mt-auto">
                    <button 
                      onClick={handlePrevious}
                      className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <FiChevronLeft className="text-lg transform rotate-180" />
                      السابق
                    </button>
                    <button 
                      onClick={handleGetStarted}
                      disabled={!name.trim()}
                      className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                        name.trim() 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-1' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      ابدء رحلتك في تنظيم فلوسك !
                      <FiChevronLeft className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-5 z-50">
      <div className="relative w-full max-w-lg flex items-center justify-center">
        {renderStep()}
        
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentStep === index ? 'bg-gradient-to-r from-blue-500 to-indigo-400 w-6' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdentifyStructure;