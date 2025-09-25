import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  BsMoon,
  BsSun,
  BsUpload,
  BsCheckCircle,
  BsExclamationTriangle,
  BsDownload,
  BsCalendar,
  BsDatabase,
  BsCheck2,
} from "react-icons/bs";

/* =========================
   Constants
   ========================= */
const THEMES = { LIGHT: "light", DARK: "dark" };
const STORAGE_KEYS = { THEME: "theme", DATA: "data" };
const SOCIAL_PLATFORMS = {
  CLIPBOARD: "clipboard",
  WHATSAPP: "whatsapp",
  TELEGRAM: "telegram",
  TWITTER: "twitter",
  FACEBOOK: "facebook",
};

/* =========================
   Utilities
   ========================= */
const safeReadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DATA);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const sortedDates = (obj) =>
  Object.keys(obj || {}).sort((a, b) => {
    const [da, ma, ya] = a.split("-").map(Number);
    const [db, mb, yb] = b.split("-").map(Number);
    return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
  });

const formatDateLocalized = (dateStr) => {
  try {
    const [d, m, y] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("ar-EG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const applyThemeSync = (theme) => {
  const root = document.documentElement;
  const isDark = theme === THEMES.DARK;
  root.classList.toggle("dark", isDark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isDark ? "#0f172a" : "#f8fafc");
};

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) {
      applyThemeSync(saved);
      return saved;
    }
    
    const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = systemPrefersDark ? THEMES.DARK : THEMES.LIGHT;
    applyThemeSync(initial);
    return initial;
  } catch {
    applyThemeSync(THEMES.LIGHT);
    return THEMES.LIGHT;
  }
};

/* =========================
   Enhanced Components
   ========================= */
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
        isDark 
          ? "bg-gradient-to-r from-purple-600 to-blue-600" 
          : "bg-gradient-to-r from-amber-300 to-orange-400"
      } shadow-lg hover:shadow-xl transform hover:scale-105`}
      aria-pressed={isDark}
    >
      <span className="sr-only">تبديل وضع المظهر</span>
      <span
        className={` h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center ${
          isDark ? "-translate-x-1" : "-translate-x-7"
        }`}
      >
        {isDark ? (
          <BsMoon className="text-purple-600 text-xs" />
        ) : (
          <BsSun className="text-amber-500 text-xs" />
        )}
      </span>
    </button>
  );
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className={`rounded-2xl p-6 text-white  bg-gradient-to-br ${color} relative overflow-hidden group transform hover:scale-105 transition-all duration-300`}>
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90 font-medium">{title}</div>
          <div className="text-2xl font-black mt-2">{value}</div>
          {subtitle && <div className="text-xs opacity-80 mt-1">{subtitle}</div>}
        </div>
        <div className="bg-white/20 p-3 -translate-y-5 rounded-full text-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const ShareButton = ({ onClick, icon, text, color }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
  >
    <span className={`text-xl group-hover:scale-110 transition-transform ${color}`}>{icon}</span>
    <span className="text-white font-medium text-sm">{text}</span>
  </button>
);

const DateCheckbox = ({ date, isSelected, onToggle, itemCount, isDark }) => (
  <div
    onClick={() => onToggle(date)}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
      isSelected
        ? isDark 
          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg" 
          : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg"
        : isDark 
          ? "bg-slate-800/50 border-slate-700 hover:border-slate-600" 
          : "bg-white border-gray-200 hover:border-gray-300"
    } group`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          isSelected
            ? "bg-green-500 border-green-500"
            : isDark
            ? "bg-slate-700 border-slate-600"
            : "bg-gray-100 border-gray-300"
        }`}>
          {isSelected && <BsCheck2 className="text-white text-sm" />}
        </div>
        <div>
          <div className={`font-semibold ${isSelected ? 'text-green-600 dark:text-green-400' : isDark ? 'text-slate-200' : 'text-gray-800'}`}>
            {formatDateLocalized(date)}
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{date}</div>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isSelected
          ? "bg-green-500 text-white"
          : isDark
          ? "bg-slate-700 text-slate-300"
          : "bg-gray-100 text-gray-600"
      }`}>
        {itemCount} عنصر
      </div>
    </div>
  </div>
);

/* =========================
   Main Component
   ========================= */
const SettingsPage = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [dataObj, setDataObj] = useState(safeReadData);
  const [dates, setDates] = useState(() => sortedDates(safeReadData()));
  const [selected, setSelected] = useState([]);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const isDark = theme === THEMES.DARK;
  const shareRef = useRef(null);
  const fileRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  /* Theme persist */
  useEffect(() => {
    applyThemeSync(theme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}
  }, [theme]);

  /* Keep date list in sync with stored data */
  useEffect(() => {
    setDates(sortedDates(dataObj));
    setSelected((prev) => prev.filter((d) => !!dataObj[d]));
  }, [dataObj]);

  /* Click outside + Escape to close share dropdown */
  useEffect(() => {
    const onDocClick = (ev) => {
      if (shareRef.current && !shareRef.current.contains(ev.target)) {
        setShowShareOptions(false);
      }
    };
    const onEsc = (ev) => {
      if (ev.key === "Escape") setShowShareOptions(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  /* Cross-tab sync */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.DATA) setDataObj(safeReadData());
      if (e.key === STORAGE_KEYS.THEME && e.newValue) {
        setTheme(e.newValue);
        applyThemeSync(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Toast helper */
  const show = useCallback((text, type = "info", ms = 3000) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ text, type });
    messageTimeoutRef.current = setTimeout(() => setMessage(null), ms);
  }, []);
  useEffect(
    () => () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    },
    []
  );

  /* Theme toggle */
  const onThemeToggle = () => {
    const newTheme = isDark ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    window.location.reload()
  };

  /* Selection helpers */
  const toggleDate = useCallback((d) => {
    setSelected((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }, []);

  const selectAll = useCallback(() => {
    setSelected((prev) => (prev.length === dates.length ? [] : [...dates]));
  }, [dates]);

  const pickLast7 = useCallback(() => {
    setSelected(dates.slice(0, 7));
  }, [dates]);

  const buildSelected = useCallback(() => {
    const out = {};
    selected.forEach((d) => {
      if (dataObj[d]) out[d] = dataObj[d];
    });
    return out;
  }, [selected, dataObj]);

  /* Share actions */
  const handleShare = () => {
    if (selected.length === 0) return show("اختر تواريخ للمشاركة أولاً", "error");
    setShowShareOptions((s) => !s);
  };

  const shareVia = async (method) => {
    try {
      const payload = JSON.stringify(buildSelected(), null, 2);
      const appUrl = window.location.origin;

      switch (method) {
        case SOCIAL_PLATFORMS.CLIPBOARD: {
          await navigator.clipboard.writeText(payload);
          show("تم نسخ البيانات إلى الحافظة");
          break;
        }
        case SOCIAL_PLATFORMS.WHATSAPP: {
          window.open(`https://wa.me/?text=${encodeURIComponent(payload)}`, "_blank");
          break;
        }
        case SOCIAL_PLATFORMS.TELEGRAM: {
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(payload)}`,
            "_blank"
          );
          break;
        }
        case SOCIAL_PLATFORMS.TWITTER: {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(payload)}`, "_blank");
          break;
        }
        case SOCIAL_PLATFORMS.FACEBOOK: {
          await navigator.clipboard.writeText(payload);
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent("تم نسخ البيانات إلى الحافظة 👇")}`,
            "_blank"
          );
          show("تم نسخ JSON؛ افتح المشاركة والصقه إذا احتجت", "info", 4000);
          break;
        }
        default:
          break;
      }
      setShowShareOptions(false);
    } catch (err) {
      console.error("Share failed:", err);
      show("فشل في المشاركة", "error");
    }
  };

  /* Copy / Download */
  const handleCopy = async () => {
    if (selected.length === 0) return show("اختر تواريخ للنسخ أولاً", "error");
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildSelected(), null, 2));
      show("تم نسخ البيانات");
    } catch {
      show("فشل النسخ", "error");
    }
  };

  const downloadJson = (obj, name = "data.json") => {
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 80);
    } catch {
      show("فشل في تنزيل الملف", "error");
    }
  };

  const handleDownloadSelected = () => {
    if (selected.length === 0) return show("اختر تواريخ للتحميل أولاً", "error");
    downloadJson(buildSelected(), "data-selected.json");
    show("تم تنزيل الملف");
  };

  const handleDownloadAll = () => {
    downloadJson(dataObj, "data-all.json");
    show("تم تنزيل جميع البيانات");
  };

  /* Import / Merge */
  const handleSetFromText = () => {
    if (!importText.trim()) return show("الصق JSON صالح أولاً", "error");
    try {
      const parsed = JSON.parse(importText);
      if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid JSON");
      const existing = safeReadData();
      const merged = { ...existing, ...parsed };
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(merged));
      setDataObj(merged);
      setImportText("");
      show("تم حفظ البيانات");
    } catch {
      show("خطأ في JSON", "error");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid JSON");
        const existing = safeReadData();
        const merged = { ...existing, ...parsed };
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(merged));
        setDataObj(merged);
        show("تم استيراد الملف");
      } catch {
        show("ملف غير صالح", "error");
      }
    };
    reader.onerror = () => show("خطأ في قراءة الملف", "error");
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} transition-all duration-500 p-4 md:p-6`}
      dir="rtl"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-3xl p-8 mb-8  `}>
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20' : 'bg-gradient-to-br from-blue-100 to-purple-100'} shadow-lg`}>
                {isDark ? (
                  <BsMoon className="text-purple-400 text-2xl" />
                ) : (
                  <BsSun className="text-amber-500 text-2xl" />
                )}
              </div>
              <div>
                <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>الإعدادات</h1>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>إدارة البيانات والمظهر</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isDark ? 'الوضع الليلي' : 'الوضع النهاري'}
              </span>
              <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="تواريخ محفوظة"
            value={dates.length}
            icon={<BsCalendar className="text-xl" />}
            color="from-blue-500 to-cyan-500"
            subtitle="إجمالي الأيام"
          />
          <StatCard
            title="محدد الآن"
            value={selected.length}
            icon={<BsCheck2 className="text-xl" />}
            color="from-emerald-500 to-teal-500"
            subtitle="جاهز للمشاركة"
          />
          <StatCard
            title="حجم البيانات"
            value={`${(JSON.stringify(dataObj).length / 1024).toFixed(1)} KB`}
            icon={<BsDatabase className="text-xl" />}
            color="from-purple-500 to-pink-500"
            subtitle="التخزين المحلي"
          />
        </div>

        {/* Share Section */}
        <div className={`rounded-3xl p-8 mb-8  ${isDark ? 'bg-slate-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} border ${isDark ? 'border-slate-700' : 'border-white/50'}`}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>مشاركة البيانات</h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>اختر الأيام التي تريد مشاركتها</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`text-lg font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selected.length} / {dates.length}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={selectAll}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isDark 
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {selected.length === dates.length ? "إلغاء الكل" : "تحديد الكل"}
                </button>
                <button
                  onClick={pickLast7}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isDark 
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  آخر 7 أيام
                </button>
              </div>
            </div>
          </div>

          {/* Dates Grid */}
          {dates.length === 0 ? (
            <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
              <BsDatabase className={`text-4xl mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>لا توجد بيانات مخزنة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-auto p-2">
              {dates.map((d) => (
                <DateCheckbox
                  key={d}
                  date={d}
                  isSelected={selected.includes(d)}
                  onToggle={toggleDate}
                  itemCount={(dataObj[d] || []).length}
                  isDark={isDark}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-slate-700/30">
        

            <button
              onClick={handleDownloadSelected}
              disabled={selected.length === 0}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 ${
                selected.length === 0
                  ? isDark 
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isDark 
                    ? "bg-slate-700 text-emerald-300 hover:bg-slate-600" 
                    : "bg-white text-green-600 hover:bg-slate-50"
              }`}
            >
              <BsDownload />
              تحميل المحدد
            </button>

            <button
              onClick={handleDownloadAll}
              disabled={dates.length === 0}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 ${
                dates.length === 0
                  ? isDark 
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isDark 
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600" 
                    : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <BsDownload />
              تنزيل الكل
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className={`rounded-3xl p-8 shadow-2xl ${isDark ? 'bg-slate-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} border ${isDark ? 'border-slate-700' : 'border-white/50'}`}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>تسجيل بيانات</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>إضافة بيانات تمت مشاركتها من شخص آخر</p>
            </div>
          </div>

        

          <div className="flex flex-wrap gap-4 mt-6">
       
            <label className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              isDark 
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
                : 'bg-white text-slate-700 hover:bg-slate-50'
            } shadow-lg hover:shadow-xl`}>
              <BsUpload />
              رفع ملف
              <input ref={fileRef} onChange={handleFile} type="file" accept=".json,application/json" className="hidden" />
            </label>

        
          </div>
        </div>

        {/* Footer */}
        <footer className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
          <div className="flex items-center justify-center gap-2 text-sm">
            <BsDatabase className="text-slate-400" />
            <span>التخزين المحلي · الوضع الحالي: {isDark ? 'ليلي' : 'نهاري'}</span>
          </div>
        </footer>

        {/* Toast Notification */}
        {message && (
          <div
            className={`fixed left-1/2 transform -translate-x-1/2 bottom-8 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-3 backdrop-blur-sm border ${
              message.type === "error" 
                ? "bg-red-500/90 border-red-400/50" 
                : "bg-green-500/90 border-green-400/50"
            } animate-bounce-in`}
          >
            {message.type === "error" ? 
              <BsExclamationTriangle className="text-xl" /> : 
              <BsCheckCircle className="text-xl" />
            }
            <div className="font-medium">{message.text}</div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: translateX(-50%) translateY(100px); opacity: 0; }
          50% { transform: translateX(-50%) translateY(-10px); opacity: 1; }
          100% { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;