import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  BsMoon,
  BsSun,
  BsShare,
  BsClipboard,
  BsUpload,
  BsCheckCircle,
  BsWhatsapp,
  BsTelegram,
  BsTwitter,
  BsFacebook,
  BsExclamationTriangle,
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
    // Newest → Oldest
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
  root.classList.toggle("dark", theme === THEMES.DARK);
  // Optional: keep CSS vars for non-Tailwind surfaces
  if (theme === THEMES.DARK) {
    root.style.setProperty("--bg-color", "#0b1220");
    root.style.setProperty("--text-color", "#f7fafc");
  } else {
    root.style.setProperty("--bg-color", "#f9fafb");
    root.style.setProperty("--text-color", "#0b1220");
  }
  // Mobile address bar color (nice touch)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0b1220" : "#f9fafb");
};

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) {
      applyThemeSync(saved);
      return saved;
    }
    
    // If no saved theme, check system preference
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
   Component
   ========================= */
const SettingsPage = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [dataObj, setDataObj] = useState(safeReadData);
  const [dates, setDates] = useState(() => sortedDates(safeReadData()));
  const [selected, setSelected] = useState([]);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

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
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    localStorage.setItem('theme',newTheme)
  };

  /* Selection helpers */
  const toggleDate = useCallback((d) => {
    setSelected((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }, []);

  const selectAll = useCallback(() => {
    setSelected((prev) => (prev.length === dates.length ? [] : [...dates]));
  }, [dates]);

  const pickLast7 = useCallback(() => {
    setSelected(dates.slice(0, 7)); // newest 7 (dates are sorted desc)
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
            `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(
              payload
            )}`,
            "_blank"
          );
          break;
        }
        case SOCIAL_PLATFORMS.TWITTER: {
          // X/Twitter has length limits; we still try
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload)}`,
            "_blank"
          );
          break;
        }
        case SOCIAL_PLATFORMS.FACEBOOK: {
          // FB sharer needs a URL; put JSON in clipboard + use quote param
          await navigator.clipboard.writeText(payload);
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              appUrl
            )}&quote=${encodeURIComponent("تم نسخ البيانات إلى الحافظة 👇")}`,
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
    // allow re-importing the same file
    e.target.value = null;
  };

  /* UI helpers */
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
      className="w-full text-right px-4 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center"
    >
      <span className="ml-3">{icon}</span>
      <span className="text-indigo-800 dark:text-slate-100">{text}</span>
    </button>
  );

  /* =========================
     Render
     ========================= */
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 showSmoothy"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center pt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-slate-100">
            إعدادات التطبيق
          </h1>
          <p className="text-indigo-700 dark:text-slate-300 mt-2 max-w-lg mx-auto">
            تحكم في المظهر، شارك بياناتك، أو استورد/صدر السجل بسرعة
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <SmallCard title="تواريخ محفوظة" value={`${dates.length}`} color="from-indigo-500 to-indigo-600" />
          <SmallCard title="محدد الآن" value={`${selected.length}`} color="from-emerald-500 to-teal-500" />
          <SmallCard
            title="حجم البيانات"
            value={`${(JSON.stringify(dataObj).length / 1024).toFixed()} KB`}
            color="from-pink-500 to-yellow-500"
          />
        </div>

        {/* Theme card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-5 mb-6 border border-indigo-100 dark:border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-slate-800">
                {theme === THEMES.DARK ? (
                  <BsMoon className="text-indigo-600" size={20} />
                ) : (
                  <BsSun className="text-indigo-600" size={20} />
                )}
              </div>
              <div>
                <div className="text-lg font-semibold text-indigo-900 dark:text-slate-100">المظهر</div>
                <div className="text-sm text-indigo-700 dark:text-slate-300">
                  اختر الوضع الفاتح أو الداكن — محفوظ في localStorage.theme
                </div>
              </div>
            </div>

            {/* Theme switch */}
<ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>

        {/* Share by days */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-5 mb-6 border border-indigo-100 dark:border-slate-800">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-indigo-900 dark:text-slate-100">شارك بيانات حسب الأيام</h2>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-sm text-indigo-600 dark:text-slate-300">
                {selected.length} / {dates.length}
              </div>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <button
                  onClick={selectAll}
                  className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
                >
                  {selected.length === dates.length ? "إلغاء الكل" : "تحديد الكل"}
                </button>
                <button
                  onClick={pickLast7}
                  className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
                >
                  آخر 7
                </button>

                <div className="relative" ref={shareRef}>
                  <button
                    onClick={handleShare}
                    disabled={selected.length === 0}
                    className={`px-3 py-2 rounded-lg ${
                      selected.length === 0
                        ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow"
                    } transition`}
                  >
                    <BsShare className="inline-block ml-2" /> مشاركة
                  </button>

                  {/* Share dropdown */}
                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-md bg-white dark:bg-slate-900 ring-1 ring-indigo-100 dark:ring-slate-800 z-40">
                      <ShareItem onClick={() => shareVia(SOCIAL_PLATFORMS.CLIPBOARD)} icon={<BsClipboard />} text="نسخ" />
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
            <div className="text-center text-indigo-600 dark:text-slate-300 py-8">
              لا توجد بيانات مخزنة حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-auto">
              {dates.map((d) => (
                <label
                  key={d}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    selected.includes(d)
                      ? "bg-indigo-50 dark:bg-slate-800 border-indigo-200 dark:border-slate-700"
                      : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(d)}
                      onChange={() => toggleDate(d)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-indigo-900 dark:text-slate-100">
                        {formatDateLocalized(d)}
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-slate-300">{d}</div>
                    </div>
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-slate-300">
                    {(dataObj[d] || []).length} عنصر
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
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                  : "bg-white dark:bg-slate-900 text-indigo-700 dark:text-slate-100 border-indigo-100 dark:border-slate-700 hover:shadow"
              }`}
            >
              نسخ المحدد
            </button>
            <button
              onClick={handleDownloadSelected}
              disabled={selected.length === 0}
              className={`px-4 py-2 rounded-lg border ${
                selected.length === 0
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                  : "bg-white dark:bg-slate-900 text-green-700 dark:text-emerald-300 border-green-100 dark:border-emerald-900/40 hover:shadow"
              }`}
            >
              تحميل المحدد
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={dates.length === 0}
              className={`px-4 py-2 rounded-lg border ${
                dates.length === 0
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-700 cursor-not-allowed"
                  : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-100 border-gray-100 dark:border-slate-700 hover:shadow"
              }`}
            >
              تنزيل الكل
            </button>
          </div>
        </div>

        {/* Import / Set data */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-5 mb-8 border border-indigo-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-indigo-900 dark:text-slate-100">استيراد / لصق بيانات</h3>
            </div>
          </div>

          <textarea
            rows={6}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='مثال: {"01-01-2024":[{"name":"منتج","price":"10","time":"12:30"}]}'
            className="w-full p-3 border border-gray-100 dark:border-slate-800 rounded-lg bg-indigo-50 dark:bg-slate-800 text-sm font-mono text-indigo-900 dark:text-slate-100"
            aria-label="مساحة لإدخال بيانات JSON"
          />

          <div className="mt-3 flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSetFromText}
              disabled={!importText.trim()}
              className={`px-4 py-2 rounded-lg flex items-center ${
                !importText.trim()
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-400"
                  : "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow"
              }`}
            >
              <BsUpload className="ml-2" /> حفظ
            </button>

            <label className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 cursor-pointer inline-flex items-center gap-2 hover:shadow">
              <BsUpload /> رفع ملف
              <input ref={fileRef} onChange={handleFile} type="file" accept=".json,application/json" className="hidden" />
            </label>

            <button
              onClick={() => {
                setImportText(JSON.stringify(dataObj, null, 2));
                show("تم لصق البيانات الحالية");
              }}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow"
            >
              لصق الحالية
            </button>
          </div>
        </div>

        <footer className="text-center text-sm text-indigo-600 dark:text-slate-300">
          localStorage.data — احفظ بياناتك محلياً · localStorage.theme = "{theme}"
        </footer>

        {/* Toast */}
        {message && (
          <div
            className={`fixed left-1/2 transform -translate-x-1/2 bottom-8 z-50 px-4 py-3 rounded-lg shadow-md text-white flex items-center ${
              message.type === "error" ? "bg-red-600" : "bg-indigo-600"
            }`}
          >
            {message.type === "error" ? <BsExclamationTriangle className="ml-2" /> : <BsCheckCircle className="ml-2" />}
            <div className="text-sm">{message.text}</div>
          </div>
        )}
      </div>

      {/* Minimal global styles for color vars & switch */}
      <style>{`
        :root { --bg-color: #f9fafb; --text-color: #0b1220; }
        .dark { --bg-color: #0b1220; --text-color: #f7fafc; }
        body { background-color: var(--bg-color); color: var(--text-color); transition: background-color .25s, color .25s; }

        .switch-input { position: absolute; opacity: 0; }
        .switch-label {
          display: inline-block; width: 56px; height: 28px; background: #e6e9f7;
          border-radius: 9999px; padding: 2px; cursor: pointer; transition: background .2s; position: relative;
        }
        .switch-label .knob {
          display: block; width: 24px; height: 24px; background: #fff; border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(16,24,40,.12); transform: translateX(0);
          transition: transform .18s cubic-bezier(.2,.9,.3,1);
        }
        .switch-input:checked + .switch-label {
          background: linear-gradient(90deg,#6366f1,#4f46e5);
        }
        .switch-input:checked + .switch-label .knob { transform: translateX(28px); }
        .switch-input:focus + .switch-label { outline: 2px solid #6366f1; outline-offset: 2px; }

        @media (max-width: 640px) { .showSmoothy { padding-bottom: 96px; } }
      `}</style>
    </div>
  );
};

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === THEMES.DARK;

  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isDark ? "bg-indigo-600" : "bg-gray-300"
      }`}
      aria-pressed={isDark}
    >
      <span className="sr-only">تبديل وضع المظهر</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};


export default SettingsPage;