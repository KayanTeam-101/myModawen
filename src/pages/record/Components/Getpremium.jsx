import React, { useEffect, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { BsChevronDown } from "react-icons/bs";
import img from "/mylogo.jpg";

/**
 * ExplainAll.jsx - explain-only modal/page
 * - Theme is still read from localStorage (so the page respects the app theme key)
 * - Theme toggle UI removed as requested
 * - Close (X) button has a fixed appearance and does NOT change with the theme key
 * - NEW: when user scrolls the content past a threshold the modal expands to full width (100vw)
 */

const sections = [
  {
    id: "about",
    title: "عن مُدوّن",
    content: (
      <>
        <p>
          <strong>مُدوّن</strong> هو تطبيق بسيط وعملي لتنظيم المصروفات اليومية. يمكن تثبيته كتطبيق عبر قائمة المتصفح
          (النقاط الثلاث → "إضافة للشاشة الرئيسية" أو "تثبيت") 
        </p>
      </>
    ),
  },
  {
    id: "install",
    title: "كيفية التثبيت (PWA)",
    content: (
      <ol className="list-decimal list-inside">
        <li>افتح التطبيق في متصفح حديث (Chrome, Edge, Firefox).</li>
        <li>من القائمة (ثلاث نقاط) اختر: "إضافة للشاشة الرئيسية" أو "تثبيت".</li>
        <li>ستحصل على اختصار يعمل كالتطبيق الأصلي دون شريط العناوين.</li>
      </ol>
    ),
  },
  {
    id: "home",
    title: "الصفحة الرئيسية",
    content: (
      <>
        <p className="mb-2">
          الصفحة الرئيسية تعرض الرصيد، زر إضافة عنصر، وقائمة العناصر المضافة بسرعة. الواجهة مصممة للالسرعة وسهولة
          الإدخال.
        </p>
        <ul className="list-disc list-inside">
          <li><strong>الرصيد:</strong> اضغط مرتين (double-tap) لتعديله مباشرة.</li>
          <li><strong>إضافة عنصر:</strong> الحقول: الاسم (مطلوب)، السعر (مطلوب)، صورة (اختياري).</li>
          <li><strong>تعديل سعر داخل القائمة:</strong> اضغط مرتين على السعر لتعديله دون فتح نافذة جديدة.</li>
          <li><strong>حذف:</strong> اضغط مطولًا (long-press) على العنصر للحذف بعد تأكيد بسيط.</li>
        </ul>
      </>
    ),
  },
  {
    id: "history",
    title: "صفحة السجل",
    content: (
      <>
        <p>السجل يعرض المصروفات مرتبة حسب التاريخ مع الوقت (س:د:ث) وصور الفواتير عند توفرها.</p>
        <p className="text-sm text-slate-500">مفيد للمراجعة اليومية أو لإيجاد إيصالات محددة.</p>
      </>
    ),
  },
  {
    id: "chart",
    title: "الجدول والتحليل",
    content: (
      <>
        <p>صفحة التحليل تعرض مخططات تُظهر تطور الإنفاق — أعمدة يومية وخط اتجاه لتحديد الاتجاهات.</p>
        <p className="text-sm text-slate-500">راجع هذه الصفحة أسبوعيًّا لمعرفة أين تذهب مصروفاتك.</p>
      </>
    ),
  },
  {
    id: "settings",
    title: "الإعدادات — مشاركة واستيراد",
    content: (
      <>
        <p>
          يمكنك مشاركة بيانات أيام محددة كنص قابل للنسخ. الطرف الآخر يُلزِم فقط أن يلصق النص في حقل "لصق البيانات"
          داخل صفحة الإعدادات واضغط "حفظ" لاستيرادها.
        </p>
        <p className="text-sm text-slate-500">الطريقة بسيطة وآمنة مادام النص يُرسل إلى أشخاص موثوقين.</p>
      </>
    ),
  },
  {
    id: "gestures",
    title: "الإيماءات والسلوكيات",
    content: (
      <ul className="list-disc list-inside">
        <li><strong>الضغط مرتين:</strong> لتعديل أرقام سريعة (الرصيد أو أسعار العناصر).</li>
        <li><strong>الضغط المطول:</strong> لحذف عنصر مع نافذة تأكيد مختصرة.</li>
        <li><strong>الضغط علي الصور:</strong> لمعاينة الصورة في نافذة مكبرة.</li>
      </ul>
    ),
  },
  {
    id: "tips",
    title: "نصائح سريعة",
    content: (
      <ul className="list-disc list-inside">
        <li>أضف صور الفواتير للعناصر ذات القيمة أو الضرورية للمراجعة.</li>
        <li>راجع صفحة الجدول أسبوعيًا لتعديل العادات.</li>
        <li>احتفظ بنسخة من البيانات إن أضفت لاحقًا خيار نسخة احتياطية سحابية.</li>
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
  const inputBg = isDark ? "bg-gray-900/40 border-gray-600 placeholder-gray-400 text-gray-200" : "bg-white border-indigo-100 text-gray-900";
  const subtleBg = isDark ? "bg-gray-700/20" : "bg-indigo-50/40";
  const accent = isDark ? "text-indigo-50" : "text-indigo-700";
  const accentLight = isDark ? "text-indigo-300" : "text-indigo-400";
  const borderAccent = isDark ? "border border-gray-800/50" : "border-indigo-100";

  const [openId, setOpenId] = useState("about");
  const [searchTerm, setSearchTerm] = useState("");

  // NEW: expand modal to full viewport width when content is scrolled beyond threshold
  const contentRef = useRef(null);
  const [isWide, setIsWide] = useState(false);
  const SCROLL_THRESHOLD = 120; // px scrolled before expanding

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
    return s.title.toLowerCase().includes(q) || (typeof s.content === "string" && s.content.toLowerCase().includes(q));
  });

  return (
    <div className={`w-full h-full fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40 backdrop-blur-sm`}> 
      {/* modal container: toggles between centered max-w and full-width when isWide */}
      <div
        className={`transition-all duration-300 ease-in-out relative h-[92vh] overflow-hidden shadow-2xl ${containerText} ${isWide ? 'w-screen max-w-none rounded-none' : 'w-full max-w-4xl rounded-2xl'} ${cardBg}`}
        style={{ top: isWide ? 0 : '4vh' }}
      >
        {/* header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`} dir="rtl">
          <div className="flex items-center gap-3">
            <img src={img} alt="شعار مُدوّن" className="w-12 h-12 rounded-lg object-cover shadow" />
            <div className="text-right">
              <h3 className={`font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>شرح وظائف التطبيق</h3>
              <p className="text-sm text-slate-500">قراءة سريعة للصفحات والإيماءات وطريقة مشاركة البيانات</p>
            </div>
          </div>

          {/* Close button: FIXED appearance (does NOT react to theme) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
              style={{ position: 'relative', zIndex: 30 }}
            >
              <RiCloseLine size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* content area (scrollable) */}
        <div ref={contentRef} className="p-5 h-[calc(92vh-112px)] overflow-auto grid grid-cols-1 md:grid-cols-3 gap-5" dir="rtl">
          {/* left summary */}
    

          {/* right: search + accordion */}
          <main className="col-span-1 md:col-span-2 space-y-4">
       

            {/* Accordion sections */}
            {filteredSections.length > 0 ? (
              filteredSections.map((s) => (
                <article key={s.id} className={`rounded-xl overflow-hidden ${cardBg} ${borderAccent} shadow-sm`}>
                  <button
                    onClick={() => setOpenId(openId === s.id ? null : s.id)}
                    className="w-full px-4 py-3 text-right flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className={`font-semibold ${accent}`}>{s.title}</h5>
                    </div>
                    <div className={`transition-transform ${openId === s.id ? "rotate-180" : "rotate-0"}`}>
                      <BsChevronDown />
                    </div>
                  </button>

                  <div className={`px-4 p transition-all duration-300 overflow-hidden ${openId === s.id ? "max-h-[1000px] ease-in" : "max-h-0"}`}>
                    <div className="pt-2 text-slate-700 dark:text-slate-600 prose prose-sm max-w-none">
                      {s.content}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className={`rounded-xl p-6 text-center ${cardBg} ${borderAccent}`}>
                <h4 className={`font-semibold ${accent}`}>لا توجد نتائج</h4>
                <p className={`text-sm mt-1 ${accentLight}`}>لم يتم العثور على أقسام تتطابق مع بحثك.</p>
              </div>
            )}

            {/* example quick tip box */}
            <div className={`rounded-lg p-4 ${isDark ? "bg-gray-900" : "bg-indigo-50/45"} ${borderAccent}`}>
              <p className="text-sm text-gray-400">
للتواصل kayanteam.business@gmail.com

            </p>
            </div>
          </main>
        </div>

        {/* footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`} dir="rtl">
          <div className="text-xs text-slate-500">© {new Date().getFullYear()} مُدوّن — تعليمات الاستخدام</div>
          <div className="flex items-center gap-3">
            <a className="text-sm underline text-slate-700 dark:text-slate-300">سياسة الخصوصية</a>
            <a className="text-sm underline text-slate-700 dark:text-slate-300">مساعدة</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainAll;
