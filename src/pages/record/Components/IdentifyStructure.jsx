import React, { useState, useEffect } from 'react';
import {  FiCamera, FiCheck, FiUser, FiChevronLeft, } from 'react-icons/fi';

const IdentifyStructure = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [cameraGranted, setCameraGranted] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false);
  const [theme, setTheme] = useState('light'); // Changed default to light
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  const steps = [
    {
      title: "مرحبا بك في مُدوّن",
      description: "هُنا حيث يمكنك جدولة وفهم معاملاتك المالية أياً كانت كبيرة أو صغير ",
      illustration: (
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
            <div className="w-32 h-32 bg-amber-300 rounded-full opacity-40 animate-pulse"></div>
          </div>
          <div className="absolute -top-2 -right-2 w-24 h-24 bg-violet-400 rounded-full opacity-40 mix-blend-lighten"></div>
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
      description:   " يمكنك تدوين مشترياتك مثل ( شراء اغراض من السوبر ماركت, موصلات إلخ..) أو (شراء 5 بكتات كُتب , شرات 3 شاشات 42 بوصة, شراء 5 طن حديد)   ",
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

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Validate Arabic input
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow Arabic letters and spaces
    if (value === '' || /^[\u0600-\u06FF\s]+$/.test(value)) {
      setName(value);
    }
  };

  const requestCameraAccess = async () => {
    setCameraRequested(true);
    try {
      // Request camera access without showing the stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      // Immediately stop all tracks to release the camera
      stream.getTracks().forEach(track => track.stop());
      
      setCameraGranted(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraGranted(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkipCamera = () => {
    setCurrentStep(4); // Skip to the next step (name input)
  };

  const handleGetStarted = () => {
    if (name.trim()) {
      localStorage.setItem('Identify', name);
      // Close the onboarding
      setShowOnboarding(false);
    }
window.location.reload()
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const renderProgressBar = () => {
    return (
      <div className="absolute top-8 left-0 right-0 mx-auto w-72 h-2 bg-gray-50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
        ></div>
      </div>
    );
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
      case 1:
      case 2:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative transition-all duration-500 ease-in-out w-full max-w-md">
              {/* Close button */}
              <button 
                onClick={handleCloseOnboarding}
                className="absolute -top-12 right-0 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
              </button>
              
              {/* Phone mockup */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl p-5 shadow-2xl shadow-blue-500/5 border border-gray-300">
                {/* Phone screen - Full height */}
                <div className="bg-gradient-to-b from-white to-gray-100 rounded-2xl h-full p-6 flex flex-col items-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-40"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-40"></div>
                  
                  {/* Illustration */}
                  <div className="my-8 transform transition-all duration-700 hover:scale-105">
                    {steps[currentStep].illustration}
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-gray-800 text-2xl font-bold text-center mb-4">
                    {steps[currentStep].title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm text-center mb-8 px-4">
                    {steps[currentStep].description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="mt-auto w-full">
                    <button 
                      onClick={handleNext}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {steps[currentStep].buttonText}
                      <FiChevronLeft  className="text-lg" />
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
              {/* Close button */}
              <button 
                onClick={handleCloseOnboarding}
                className="absolute -top-12 right-0 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
              </button>
              
              {/* Phone mockup */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl p-5 shadow-2xl shadow-blue-500/5 border border-gray-300">
                {/* Phone screen - Full height */}
                <div className="bg-gradient-to-b from-white to-gray-100 rounded-2xl h-full p-6 flex flex-col items-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-40"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-40"></div>
                  
                  {/* Title */}
                  <h2 className="text-gray-800 text-2xl font-bold text-center mb-4 mt-4">
                    تفعيل الكاميرا
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm text-center mb-8 px-4">
                 يطلب مُدون إذن الكاميرا لتشغيل صفحة إضافة عنصر بإستخدام الكاميرا , إذا كنت لا تريد التفعيل الان الرجاء الضغط علي "تخطي"
                  </p>
                  
                  {/* Camera icon */}
                  <div className="w-48 h-48 bg-gray-100 rounded-2xl mb-8 overflow-hidden flex items-center justify-center border border-gray-300 shadow-inner">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiCamera className="text-6xl mb-4" />
                      <p className="text-sm">Camera Access</p>
                    </div>
                  </div>
                  
                  {/* Request camera access button */}
                  <div className="w-full mb-4">
                    <button 
                      onClick={requestCameraAccess}
                      disabled={cameraRequested}
                      className={`w-full font-black py-4 rounded-xl  flex items-center justify-center gap-2 transition-all duration-300 ${
                        cameraGranted
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                          : cameraRequested
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                      }`}
                    >
                      {cameraGranted 
                        ? 'تم قبول الاذن' 
                        : cameraRequested 
                        ? '...' 
                        : 'إعطاء الاذن'
                      }
                      <FiCamera />
                    </button>
                  </div>
                  
                  {/* Skip button */}
                  <div className="w-full mb-4">
                    <button 
                      onClick={handleSkipCamera}
                      className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300"
                    >
                     التخطي
                    </button>
                  </div>
                  
                  {/* Continue button */}
                  <div className="w-full mt-auto">
                    <button 
                      onClick={handleNext}
                      disabled={!cameraGranted}
                      className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                        cameraGranted 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
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
              {/* Close button */}
              <button 
                onClick={handleCloseOnboarding}
                className="absolute -top-12 right-0 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
              </button>
              
              {/* Phone mockup */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl p-5 shadow-2xl shadow-blue-500/5 border border-gray-300">
                {/* Phone screen - Full height */}
                <div className="bg-gradient-to-b from-white to-gray-100 rounded-2xl h-full p-6 flex flex-col items-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-40"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-40"></div>
                  
                  {/* Title */}
                  <h2 className="text-gray-600 font-bold text-center mb-4 mt-4">
                   هنحتاج بس اسمك , و المظهر للبرنامج حيث كان وضع ليلي أو نهاري
                  </h2>
                  
                  {/* Name input */}
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
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">يسمح فقط بالأحرف العربية</p>
                  </div>
                  
                  {/* Theme selection */}
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
                        {theme === 'dark' && <FiCheck className="text-blue-500" />}
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
                        {theme === 'light' && <FiCheck className="text-blue-500" />}
                        نهاري
                      </button>
                    </div>
                  </div>
                  
                  {/* Get Started button */}
                  <div className="w-full mt-auto">
                    <button 
                      onClick={handleGetStarted}
                      disabled={!name.trim()}
                      className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
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
    return null; // This removes the onboarding from the DOM
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 overflow-hidden z-50">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-xl"></div>
      
      {/* Main content container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Progress bar */}
        {renderProgressBar()}
        
        {/* Step content */}
        {renderStep()}
        
        {/* Step indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentStep === step ? 'bg-blue-500 w-6' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdentifyStructure;