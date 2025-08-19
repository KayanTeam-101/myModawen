import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  BsMoon,
  BsSun,
  BsShare,
  BsClipboard,
  BsDownload,
  BsUpload,
  BsTrash,
  BsCheckCircle,
  BsWhatsapp,
  BsTelegram,
  BsTwitter,
  BsFacebook,
  BsExclamationTriangle,
} from "react-icons/bs";

// Constants for better maintainability
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const STORAGE_KEYS = {
  THEME: "theme",
  DATA: "data",
};

const SOCIAL_PLATFORMS = {
  CLIPBOARD: "clipboard",
  WHATSAPP: "whatsapp",
  TELEGRAM: "telegram",
  TWITTER: "twitter",
  FACEBOOK: "facebook",
};

// Utility functions outside component
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

const sortedDates = (obj) => {
  return Object.keys(obj || {}).sort((a, b) => {
    const [da, ma, ya] = a.split("-").map(Number);
    const [db, mb, yb] = b.split("-").map(Number);
    return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
  });
};

const applyThemeSync = (t) => {
  const root = document.documentElement;
  if (t === THEMES.DARK) {
    root.classList.add("dark");
    root.style.setProperty("--bg-color", "#0b1220");
    root.style.setProperty("--text-color", "#f7fafc");
  } else {
    root.classList.remove("dark");
    root.style.setProperty("--bg-color", "#f9fafb");
    root.style.setProperty("--text-color", "#0b1220");
  }
};

const formatDateLocalized = (dateStr) => {
  try {
    const [d, m, y] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("ar-EG", { 
      weekday: "short", 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  } catch {
    return dateStr;
  }
};

const SettingsPage = () => {
  // Theme initialization with proper default
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (!savedTheme) {
        localStorage.setItem(STORAGE_KEYS.THEME, THEMES.LIGHT);
        applyThemeSync(THEMES.LIGHT);
        return THEMES.LIGHT;
      }
      applyThemeSync(savedTheme);
      return savedTheme;
    } catch {
      applyThemeSync(THEMES.LIGHT);
      return THEMES.LIGHT;
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [dataObj, setDataObj] = useState(safeReadData);
  const [dates, setDates] = useState(() => sortedDates(safeReadData()));
  const [selected, setSelected] = useState([]);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareRef = useRef();
  const fileRef = useRef();
  const messageTimeoutRef = useRef();
  if (!localStorage.getItem('data')) {
      window.location.href='/'
    }
  // Apply theme and persist
  useEffect(() => {
    applyThemeSync(theme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, [theme]);

  // Update dates when dataObj changes
  useEffect(() => {
    setDates(sortedDates(dataObj));
    setSelected((prev) => prev.filter((d) => dataObj[d]));
  }, [dataObj]);

  // Click outside to close share menu
  useEffect(() => {
    const handler = (ev) => {
      if (shareRef.current && !shareRef.current.contains(ev.target)) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Storage sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.DATA) {
        const newData = safeReadData();
        setDataObj(newData);
      }
      if (e.key === STORAGE_KEYS.THEME) {
        const newTheme = e.newValue || THEMES.LIGHT;
        setTheme(newTheme);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Toast message with cleanup
  const show = useCallback((msg, type = "info", ms = 3000) => {
    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    setMessage({ text: msg, type });
    messageTimeoutRef.current = setTimeout(() => setMessage(null), ms);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // Theme switch handler
  const onThemeToggle = (e) => {
    const newTheme = e.target.checked ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  };

  // Selection helpers
  const toggleDate = useCallback((d) => {
    setSelected((prev) => 
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
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

  // Sharing functionality
  const handleShare = () => {
    if (selected.length === 0) {
      show("اختر تواريخ للمشاركة أولاً", "error");
      return;
    }
    setShowShareOptions((s) => !s);
  };

  const shareVia = async (method) => {
    try {
      const text = JSON.stringify(buildSelected(), null, 2);
      const shareUrl = window.location.origin;
      const shareText="";

      switch (method) {
        case SOCIAL_PLATFORMS.CLIPBOARD:
          await navigator.clipboard.writeText(text);
          show("تم نسخ البيانات إلى الحافظة");
          break;
        case SOCIAL_PLATFORMS.WHATSAPP:
          window.open(
            `https://wa.me/?text=${encodeURIComponent(text)}`,
            "_blank"
          );
          break;
        case SOCIAL_PLATFORMS.TELEGRAM:
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
            "_blank"
          );
          break;
        case SOCIAL_PLATFORMS.TWITTER:
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
          break;
        case SOCIAL_PLATFORMS.FACEBOOK:
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(text)}`, "_blank");
          break;
        default:
          console.warn("Unknown sharing method:", method);
      }

      setShowShareOptions(false);
    } catch (error) {
      console.error("Sharing failed:", error);
      show("فشل في المشاركة", "error");
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (selected.length === 0) {
      show("اختر تواريخ للنسخ أولاً", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildSelected()));
      show("تم نسخ البيانات");
    } catch (error) {
      console.error("Copy failed:", error);
      show("فشل النسخ", "error");
    }
  };

  // Download functionality
  const downloadJson = (obj, name = "data.json") => {
    try {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Download failed:", error);
      show("فشل في تنزيل الملف", "error");
    }
  };

  const handleDownloadSelected = () => {
    if (selected.length === 0) {
      show("اختر تواريخ للتحميل أولاً", "error");
      return;
    }
    downloadJson(buildSelected(), "data-selected.json");
    show("تم تنزيل الملف");
  };

  const handleDownloadAll = () => {
    downloadJson(dataObj, "data-all.json");
    show("تم تنزيل جميع البيانات");
  };

  // Import/Export functionality
const handleSetFromText = () => {
  if (!importText.trim()) {
    show("الصق JSON صالح أولاً", "error");
    return;
  }
  try {
    const parsed = JSON.parse(importText);
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Invalid JSON object");
    }

    // Get existing data
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.DATA) || "{}");

    // Merge old + new (if both are objects)
    const merged = { ...existing, ...parsed };

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(merged));

    // Update state
    setDataObj(merged);
    setImportText("");
    show("تم حفظ البيانات");
  } catch (error) {
    console.error("JSON parse error:", error);
    show("خطأ في JSON", "error");
  }
};

const handleFile = (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;



  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Invalid JSON object");
      }

      // Get existing data
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.DATA) || "{}");

      // Merge old + new (objects)
      const merged = { ...existing, ...parsed };

      // Save merged data
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(merged));

      // Update state
      setDataObj(merged);
      show("تم استيراد الملف");
    } catch (error) {
      console.error("File import error:", error);
      show("ملف غير صالح", "error");
    }
  };
  reader.onerror = () => {
    show("خطأ في قراءة الملف", "error");
  };
  reader.readAsText(file);

  // reset input so user can re-import same file if needed
  e.target.value = null;
};



  // Share app link
  const shareApp = async () => {
    const appUrl = window.location.origin;
    const shareText = "جرب هذا التطبيق الرائع لإدارة المصروفات اليومية!";
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: "تطبيق إدارة المصروفات", 
          text: shareText, 
          url: appUrl 
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${appUrl}`);
        show("تم نسخ رابط التطبيق إلى الحافظة");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${shareText} ${appUrl}`);
        show("تم نسخ رابط التطبيق إلى الحافظة");
      }
    }
  };

  // UI Components
  const SmallCard = ({ title, value, color = "from-indigo-500 to-indigo-600" }) => (
    <div className={`rounded-2xl p-4 text-white shadow-lg bg-gradient-to-r ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90">{title}</div>
          <div className="text-xl font-bold mt-1">{value}</div>
        </div>
        <div className="bg-white/20 p-3 rounded-full" />
      </div>
    </div>
  );

  const ShareItem = ({ onClick, icon, text }) => (
    <button 
      onClick={onClick} 
      className="w-full text-right px-4 py-2 hover:bg-indigo-50 flex items-center"
    >
      <span className="ml-3">{icon}</span>
      <span className="text-indigo-800">{text}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-6 showSmoothy" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center pt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">إعدادات التطبيق</h1>
          <p className="text-indigo-700 mt-2 max-w-lg mx-auto">
            تحكم في المظهر، شارك بياناتك، أو استورد/صدر السجل بسرعة
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <SmallCard 
            title="تواريخ محفوظة" 
            value={`${dates.length}`} 
            color="from-indigo-500 to-indigo-600" 
          />
          <SmallCard 
            title="محدد الآن" 
            value={`${selected.length}`} 
            color="from-emerald-400 to-teal-500" 
          />
          <SmallCard 
            title="حجم البيانات" 
            value={`${(JSON.stringify(dataObj).length / 1024).toFixed()} KB`} 
            color="from-pink-500 to-yellow-500" 
          />
        </div>

        {/* Theme card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-50">
                {theme === THEMES.DARK ? (
                  <BsMoon className="text-indigo-600" size={20} />
                ) : (
                  <BsSun className="text-indigo-600" size={20} />
                )}
              </div>
              <div>
                <div className="text-lg font-semibold text-indigo-900">المظهر</div>
                <div className="text-sm text-indigo-700">
                  اختر الوضع الفاتح أو الداكن — المحفوظ في localStorage.theme
                </div>
              </div>
            </div>

            {/* Theme switch */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-indigo-700">فاتح</div>
              <div className="relative">
                <input
                  id="theme-switch"
                  type="checkbox"
                  className="sr-only switch-input"
                  checked={theme === THEMES.DARK}
                  onChange={onThemeToggle}
                  aria-label="تبديل وضع المظهر"
                />
                <label htmlFor="theme-switch" className="switch-label inline-block" aria-hidden>
                  <span className="knob" />
                </label>
              </div>
              <div className="text-sm text-indigo-700">داكن</div>
            </div>
          </div>
        </div>

        {/* Share by days */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-indigo-100">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-indigo-900">شارك بيانات حسب الأيام</h2>
              <p className="text-sm text-indigo-700">
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-sm text-indigo-600">
                {selected.length} / {dates.length}
              </div>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <button 
                  onClick={selectAll} 
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  {selected.length === dates.length ? "إلغاء الكل" : "تحديد الكل"}
                </button>
                <button 
                  onClick={pickLast7} 
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  آخر 7
                </button>

                <div className="relative">
                  <button
                    onClick={handleShare}
                    disabled={selected.length === 0}
                    className={`px-3 py-2 rounded-lg ${
                      selected.length === 0 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow"
                    } transition`}
                  >
                    <BsShare className="inline-block ml-2" /> مشاركة
                  </button>

                  {/* Share dropdown */}
                  {showShareOptions && (
                    <div 
                      ref={shareRef} 
                      className="absolute right-0 mt-2 w-44 rounded-lg shadow-md bg-white ring-1 ring-indigo-100 z-40"
                    >
                      <ShareItem 
                        onClick={() => shareVia(SOCIAL_PLATFORMS.CLIPBOARD)} 
                        icon={<BsClipboard />} 
                        text="نسخ" 
                      />
                      <ShareItem 
                        onClick={() => shareVia(SOCIAL_PLATFORMS.WHATSAPP)} 
                        icon={<BsWhatsapp className="text-green-500" />} 
                        text="واتساب" 
                      />
                      <ShareItem 
                        onClick={() => shareVia(SOCIAL_PLATFORMS.TELEGRAM)} 
                        icon={<BsTelegram className="text-blue-400" />} 
                        text="تيليجرام" 
                      />
                      <ShareItem 
                        onClick={() => shareVia(SOCIAL_PLATFORMS.TWITTER)} 
                        icon={<BsTwitter className="text-blue-400" />} 
                        text="تويتر" 
                      />
                      <ShareItem 
                        onClick={() => shareVia(SOCIAL_PLATFORMS.FACEBOOK)} 
                        icon={<BsFacebook className="text-blue-600" />} 
                        text="فيسبوك" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {dates.length === 0 ? (
            <div className="text-center text-indigo-600 py-8">
              لا توجد بيانات مخزنة حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-auto">
              {dates.map((d) => (
                <label 
                  key={d} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selected.includes(d) 
                      ? "bg-indigo-50 border-indigo-200" 
                      : "bg-white border-gray-100"
                  } cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selected.includes(d)} 
                      onChange={() => toggleDate(d)} 
                      className="rounded text-indigo-600 focus:ring-indigo-500" 
                    />
                    <div>
                      <div className="text-sm font-medium text-indigo-900">
                        {formatDateLocalized(d)}
                      </div>
                      <div className="text-xs text-indigo-600">{d}</div>
                    </div>
                  </div>
                  <div className="text-xs text-indigo-600">
                    {Object.keys(dataObj[d] || {}).length} عنصر
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button 
              onClick={handleCopy} 
              disabled={selected.length === 0}
              className={`px-4 py-2 rounded-lg border ${
                selected.length === 0
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-indigo-700 border-indigo-100 hover:shadow"
              }`}
            >
              نسخ المحدد
            </button>
            <button 
              onClick={handleDownloadSelected} 
              disabled={selected.length === 0}
              className={`px-4 py-2 rounded-lg border ${
                selected.length === 0
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-green-700 border-green-100 hover:shadow"
              }`}
            >
              تحميل المحدد
            </button>
            <button 
              onClick={handleDownloadAll} 
              disabled={dates.length === 0}
              className={`px-4 py-2 rounded-lg border ${
                dates.length === 0
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-100 hover:shadow"
              }`}
            >
              تنزيل الكل
            </button>
          </div>
        </div>

        {/* Import / Set data */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8 border border-indigo-100">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-indigo-900">استيراد / لصق بيانات</h3>
            </div>
          </div>

          <textarea
            rows={6}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='مثال: {"01-01-2024":[{"name":"منتج","price":"10","time":"12:30"}]}'
            className="w-full p-3 border border-gray-100 rounded-lg bg-indigo-50 text-sm font-mono text-indigo-900"
            aria-label="مساحة لإدخال بيانات JSON"
          />

          <div className="mt-3 flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSetFromText}
              disabled={!importText.trim()}
              className={`px-4 py-2 rounded-lg flex items-center ${
                !importText.trim() 
                  ? "bg-gray-100 text-gray-400" 
                  : "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow"
              }`}
            >
              <BsUpload className="ml-2" /> حفظ
            </button>

            <label className="px-4 py-2 rounded-lg bg-white border border-gray-100 cursor-pointer inline-flex items-center gap-2 hover:shadow">
              <BsUpload /> رفع ملف
              <input 
                ref={fileRef} 
                onChange={handleFile} 
                type="file" 
                accept=".json,application/json" 
                className="hidden" 
              />
            </label>

            <button 
              onClick={() => { 
                setImportText(JSON.stringify(dataObj, null, 2)); 
                show("تم لصق البيانات الحالية"); 
              }} 
              className="px-4 py-2 rounded-lg bg-white border border-gray-100 hover:shadow"
            >
              لصق الحالية
            </button>

          </div>
        </div>

        <footer className="text-center text-sm text-indigo-600">
          localStorage.data — احفظ بياناتك محلياً · localStorage.theme = "{theme}"
        </footer>

        {/* Toast message */}
        {message && (
          <div className={`fixed left-1/2 transform -translate-x-1/2 bottom-8 z-50 px-4 py-3 rounded-lg shadow-md text-white flex items-center ${
            message.type === "error" ? "bg-red-600" : "bg-indigo-600"
          }`}>
            {message.type === "error" ? (
              <BsExclamationTriangle className="ml-2" />
            ) : (
              <BsCheckCircle className="ml-2" />
            )}
            <div className="text-sm">{message.text}</div>
          </div>
        )}
      </div>

      {/* Global styles */}
      <style jsx global>{`
        :root {
          --bg-color: #f9fafb;
          --text-color: #0b1220;
        }
        .dark {
          --bg-color: #0b1220;
          --text-color: #f7fafc;
        }
        body {
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        /* Switch styling */
        .switch-input { 
          position: absolute; 
          opacity: 0; 
        }
        .switch-label {
          display: inline-block;
          width: 56px;
          height: 28px;
          background: #e6e9f7;
          border-radius: 9999px;
          padding: 2px;
          cursor: pointer;
          transition: background 0.2s ease;
          position: relative;
        }
        .switch-label .knob {
          display: block;
          width: 24px;
          height: 24px;
          background: #fff;
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(16,24,40,0.12);
          transform: translateX(0);
          transition: transform 0.18s cubic-bezier(.2,.9,.3,1);
        }
        .switch-input:checked + .switch-label {
          background: linear-gradient(90deg,#6366f1,#4f46e5);
        }
        .switch-input:checked + .switch-label .knob {
          transform: translateX(28px);
        }
        .switch-input:focus + .switch-label {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .showSmoothy { padding-bottom: 96px; }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;