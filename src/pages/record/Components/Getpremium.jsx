import React, { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiDownloadLine } from "react-icons/ri";
import { BsChevronDown } from "react-icons/bs";
import img from "/mylogo.jpg";

// PWA Install Button Component
const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if PWA is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
      
      // Alternative check for iOS
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsSupported(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Check if PWA is supported
    if (!('BeforeInstallPromptEvent' in window)) {
      setIsSupported(false);
    }

    checkInstalled();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Installation failed:', error);
      setIsSupported(false);
    }
  };

  if (isInstalled) {
    return (
      <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center justify-center gap-2">
          <span className="text-lg">✅</span>
          التطبيق مثبت بالفعل على جهازك
        </p>
        <p className="text-green-600 dark:text-green-400 text-xs mt-1">
          يمكنك فتحه مباشرة من الشاشة الرئيسية
        </p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
          <span className="text-lg">⚠️</span>
          متصفحك لا يدعم التثبيت التلقائي
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
          استخدم الإرشادات أعلاه للتثبيت يدويًا
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-3">
      <button
        onClick={handleInstallClick}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
      >
        <RiDownloadLine className="text-xl" />
        <span>تثبيت التطبيق على جهازي</span>
      </button>
      
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        ⚡ سيعمل التطبيق أسرع وبدون اتصال إنترنت
      </p>
    </div>
  );
};

const sections = [
  {
    id: "about",
    title: "عن مُدوّن",
    content: (
      <>
        <p className="mb-4">
          <strong>مُدوّن</strong> هو دفتر إلكتروني لتتبع و تنظيم المصروفات بطريقة سهلة و سلسة
          تم تصميمه ليكون سهل الاستخدام مع الحفاظ على الخصوصية الكاملة لبياناتك.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            💡 جميع بياناتك تُخزن محليًا على جهازك فقط، مما يضمن خصوصية تامة.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "install",
    title: "كيفية التثبيت",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-green-800 dark:text-green-200 text-sm font-medium flex items-center gap-2">
            <span className="text-lg">💡</span>
            التطبيق يدعم التثبيت التلقائي! قد تظهر نافذة تلقائية لطلب التثبيت.
          </p>
        </div>
        
        {/* التثبيت التلقائي */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-lg border-r-4 border-indigo-500 pr-2">
            التثبيت التلقائي (مُوصى به)
          </h4>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <p className="text-indigo-800 dark:text-indigo-200 text-sm mb-3">
              استخدم الزر أدناه لتثبيت التطبيق بضغطة واحدة:
            </p>
            <PWAInstallButton />
          </div>
        </div>

        {/* التثبيت اليدوي */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-lg border-r-4 border-blue-500 pr-2">
            التثبيت اليدوي
          </h4>
          
          <div className="grid gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span>💻</span> لجهاز الكمبيوتر
              </h5>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mr-2">
                <li>افتح التطبيق في متصفح Chrome أو Edge</li>
                <li>ابحث عن أيقونة التثبيت (🔧) في شريط العنوان</li>
                <li>انقر على "تثبيت" أو "Install"</li>
                <li>ستظهر نافذة تأكيد → انقر على "تثبيت"</li>
              </ol>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span>📱</span> للهواتف الذكية
              </h5>
              
              <div className="grid gap-3 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong className="text-blue-800 dark:text-blue-200">Android (Chrome):</strong>
                  <ol className="list-decimal list-inside mr-2 mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                    <li>افتح القائمة (النقاط الثلاث أعلى اليمين)</li>
                    <li>اختر "إضافة إلى الشاشة الرئيسية"</li>
                    <li>انقر على "إضافة"</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <strong className="text-blue-800 dark:text-blue-200">iOS (Safari):</strong>
                  <ol className="list-decimal list-inside mr-2 mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                    <li>انقر على زر المشاركة (السهم لأعلى)</li>
                    <li>اختر "إضافة إلى الشاشة الرئيسية"</li>
                    <li>انقر على "إضافة" في الزاوية اليمنى العليا</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* مزايا التثبيت */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <span>⭐</span> مزايا التثبيت
          </h5>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside mr-2">
            <li>فتح التطبيق مباشرة من الشاشة الرئيسية</li>
            <li>عمل أسرع وتجربة أفضل</li>
            <li>الدعم الكامل للعمل دون اتصال بالإنترنت</li>
            <li>إشعارات مهمة (قريبًا)</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "home",
    title: "الصفحة الرئيسية",
    content: (
      <>
        <p className="mb-4">
          الصفحة الرئيسية تعرض الرصيد، زر إضافة عنصر، وقائمة العناصر المضافة.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-800 dark:text-gray-200">الرصيد:</strong> عبارة عن رقم وهمي يُعبر عن كمية الأموال المملوكة في اليد، يمكنك تعديله بالنقر عليه مرتين</li>
          <li><strong className="text-gray-800 dark:text-gray-200">إضافة عنصر:</strong> الحقول: الاسم (مطلوب)، السعر (مطلوب)، صوت (اختياري)</li>
          <li><strong className="text-gray-800 dark:text-gray-200">تعديل سعر داخل القائمة:</strong> اضغط مرتين على السعر لتعديله دون فتح نافذة جديدة</li>
          <li><strong className="text-gray-800 dark:text-gray-200">حذف:</strong> اضغط مطولاً على العنصر للحذف بعد تأكيد بسيط</li>
        </ul>
        
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            💡 يمكنك سحب القائمة لأسفل لتحديث البيانات عند الحاجة.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "history",
    title: "صفحة السجل",
    content: (
      <>
        <p className="mb-3">السجل يعرض المصروفات مرتبة حسب التاريخ مع الوقت (س:د:ث) وصور الفواتير عند توفرها.</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">مفيد للمراجعة اليومية أو لإيجاد إيصالات محددة.</p>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200 text-sm">
            📊 يمكنك تصفية السجل حسب التاريخ أو نوع المصروفات.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "chart",
    title: "الجدول والتحليل",
    content: (
      <>
        <p className="mb-3">صفحة التحليل تعرض مخططات تُظهر تطور الإنفاق — أعمدة يومية وخط اتجاه لتحديد الاتجاهات.</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">راجع هذه الصفحة أسبوعيًّا لمعرفة أين تذهب مصروفاتك.</p>
        
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>مخطط الأعمدة: يُظهر إجمالي المصروفات اليومية</li>
          <li>خط الاتجاه: يساعد في تحديد إذا كانت مصروفاتك في زيادة أو نقصان</li>
          <li>إحصائيات سريعة: أعلى وأقل يوم في المصروفات</li>
        </ul>
      </>
    ),
  },
  {
    id: "settings",
    title: "الإعدادات — مشاركة واستيراد",
    content: (
      <>
        <p className="mb-4">
          يمكنك مشاركة بيانات أيام محددة كنص قابل للنسخ. الطرف الآخر يُلزِم فقط أن يلصق النص في حقل "لصق البيانات"
          داخل صفحة الإعدادات واضغط "حفظ" لاستيرادها.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">الطريقة بسيطة وآمنة مادام النص يُرسل إلى أشخاص موثوقين.</p>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <p className="text-purple-800 dark:text-purple-200 text-sm">
            🔄 يمكنك أيضًا إنشاء نسخة احتياطية من جميع بياناتك.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "gestures",
    title: "الإيماءات والسلوكيات",
    content: (
      <div className="space-y-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">👆 الضغط مرتين</h5>
          <p className="text-orange-700 dark:text-orange-300 text-sm">لتعديل أرقام سريعة (الرصيد أو أسعار العناصر)</p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">⏱️ الضغط المطول</h5>
          <p className="text-red-700 dark:text-red-300 text-sm">لحذف عنصر مع نافذة تأكيد مختصرة</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🖼️ الضغط على الصور</h5>
          <p className="text-blue-700 dark:text-blue-300 text-sm">لمعاينة الصورة في نافذة مكبرة</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">⬇️ السحب لأسفل</h5>
          <p className="text-green-700 dark:text-green-300 text-sm">لتحديث البيانات في الصفحة الرئيسية</p>
        </div>
      </div>
    ),
  },
  {
    id: "tips",
    title: "نصائح سريعة",
    content: (
      <ul className="list-disc list-inside space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <li className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <strong className="text-blue-800 dark:text-blue-200">📸 صور الفواتير:</strong> أضف صور الفواتير للعناصر ذات القيمة أو الضرورية للمراجعة
        </li>
        <li className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <strong className="text-green-800 dark:text-green-200">📊 المراجعة الأسبوعية:</strong> راجع صفحة الجدول أسبوعيًا لتعديل العادات
        </li>
        <li className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
          <strong className="text-purple-800 dark:text-purple-200">💾 النسخ الاحتياطي:</strong> احتفظ بنسخة من البيانات بانتظام
        </li>
        <li className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <strong className="text-orange-800 dark:text-orange-200">🔔 التذكيرات:</strong> اضبط تذكيرات للمصروفات الدورية
        </li>
      </ul>
    ),
  },
];

const ExplainAll = ({ onClose = () => {} }) => {
  // read theme but do not expose toggles
  const THEME = typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light";
  const [theme] = useState(THEME);
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const containerText = isDark ? "text-gray-100" : "text-gray-900";
  const cardBg = isDark ? "bg-gray-950 border border-white/5" : "bg-white border-gray-100";
  const borderAccent = isDark ? "border border-gray-800/50" : "border-indigo-100";
  const accent = isDark ? "text-indigo-50" : "text-indigo-700";

  const [openId, setOpenId] = useState("about");
  const [searchTerm, setSearchTerm] = useState("");

  // Expand modal to full viewport width when content is scrolled beyond threshold
  const contentRef = useRef(null);
  const [isWide, setIsWide] = useState(false);
  const SCROLL_THRESHOLD = 120;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onScroll = () => {
      const s = el.scrollTop || 0;
      if (s > SCROLL_THRESHOLD && !isWide) setIsWide(true);
      if (s <= SCROLL_THRESHOLD && isWide) setIsWide(false);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isWide]);

  const filteredSections = sections.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return s.title.toLowerCase().includes(q) || 
           (typeof s.content === 'string' ? s.content.toLowerCase().includes(q) : false);
  });

  return (
    <div className={`w-full h-full fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm`}>
      <div
        className={`transition-all duration-300 ease-in-out relative h-[95vh] overflow-hidden shadow-2xl ${containerText} ${
          isWide ? 'w-screen max-w-none rounded-none' : 'w-full max-w-4xl rounded-2xl'
        } ${cardBg}`}
        style={{ top: isWide ? '2vh' : '5vh' }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-gray-800' : 'border-gray-100'
          }`}
          dir="rtl"
        >
          <div className="flex items-center gap-4">
            <img src={img} alt="شعار مُدوّن" className="w-14 h-14 rounded-xl object-cover shadow-lg" />
            <div className="text-right">
              <h3 className={`font-bold text-xl ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                شرح وظائف التطبيق
              </h3>
              <p className="text-sm text-slate-500">قراءة سريعة للصفحات والإيماءات وطريقة مشاركة البيانات</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 border border-gray-200 dark:border-gray-700"
            style={{ position: 'relative', zIndex: 30 }}
          >
            <RiCloseLine size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content area */}
        <div
          ref={contentRef}
          className="p-6 h-[calc(95vh-120px)] overflow-auto grid grid-cols-1 lg:grid-cols-4 gap-6"
          dir="rtl"
        >
          {/* Left sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <div className={`sticky top-0 rounded-xl p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${accent}`}>عناصر المساعدة</h4>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setOpenId(openId === section.id ? null : section.id)}
                    className={`w-full text-right p-3 rounded-lg transition-all duration-200 ${
                      openId === section.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right content - Accordion */}
          <main className="lg:col-span-3 space-y-6">
            {filteredSections.length > 0 ? (
              filteredSections.map((s) => (
                <article
                  key={s.id}
                  className={`rounded-2xl overflow-hidden ${cardBg} ${borderAccent} shadow-lg transition-all duration-300 ${
                    openId === s.id ? 'ring-2 ring-indigo-500/20' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpenId(openId === s.id ? null : s.id)}
                    className="w-full px-6 py-4 text-right flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'
                      }`}>
                        <span className={`text-lg ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                          {sections.findIndex(sec => sec.id === s.id) + 1}
                        </span>
                      </div>
                      <div className="text-right">
                        <h5 className={`font-bold text-lg ${accent}`}>{s.title}</h5>
                      </div>
                    </div>
                    <div
                      className={`transition-transform duration-300 text-gray-500 ${
                        openId === s.id ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      <BsChevronDown size={20} />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 overflow-hidden ${
                      openId === s.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300 prose prose-lg max-w-none">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        {s.content}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className={`rounded-2xl p-8 text-center ${cardBg} ${borderAccent} shadow-lg`}>
                <div className="text-6xl mb-4">🔍</div>
                <h4 className={`font-semibold text-xl ${accent}`}>لا توجد نتائج</h4>
                <p className={`text-sm mt-2 text-gray-500 dark:text-gray-400`}>
                  لم يتم العثور على أقسام تتطابق مع بحثك.
                </p>
              </div>
            )}

            {/* Contact info */}
            <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-900' : 'bg-indigo-50/45'} ${borderAccent} shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className={`font-semibold ${accent}`}>للتواصل والدعم</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    نحن هنا لمساعدتك في أي وقت
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                    kayanteam.business@gmail.com
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    الرد خلال 24 ساعة
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isDark ? 'border-gray-800' : 'border-gray-100'
          }`}
          dir="rtl"
        >
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} مُدوّن — تعليمات الاستخدام v2.0
          </div>
          <div className="flex items-center gap-4">
            <a className="text-sm underline text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              سياسة الخصوصية
            </a>
            <a className="text-sm underline text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              المساعدة
            </a>
            <a className="text-sm underline text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainAll;