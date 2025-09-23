// index.jsx
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { registerSW } from 'virtual:pwa-register';
import { Analytics } from '@vercel/analytics/react';

// === CONFIG ===
const NOTIFICATION_TITLE = 'رسالة 300';
const NOTIFICATION_OPTIONS = { body: 'الرسالة رقم 300 — التذكير اليومي', tag: 'daily-300' };

// حساب المدة حتى الساعة 12:00 الظهر
function msUntilNextNoon() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(12, 0, 0, 0);
  if (now >= next) next.setDate(next.getDate() + 1);
  return next - now;
}



// show notification from page (fallback)
function showLocalNotification() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification(NOTIFICATION_TITLE, NOTIFICATION_OPTIONS);
  } else {
    console.warn('No notification permission');
  }
}

// in-page scheduler (works فقط طالما الصفحة مفتوحة)
function startInPageScheduler() {
  const delay = msUntilNextNoon();
  console.log('in-page scheduler: next notify in ms', delay);
  setTimeout(() => {
    showLocalNotification();
    setInterval(showLocalNotification, 24 * 60 * 60 * 1000);
  }, delay);
}

// سجل الـ Service Worker و حاوِل تسجيل periodicSync (إن كان مدعوماً)
async function registerAndTryPeriodicSync() {
  if (!('serviceWorker' in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js'); // ضع sw.js في root (public)
    console.log('SW registered', reg);

    // نطلب إذن periodic-background-sync عبر Permissions API (إن كان مدعوم)
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
        console.log('periodic-background-sync permission state:', status.state);
        // Note: some browsers won't grant until install/PWA
      } catch (e) {
        // بعض المتصفحات لا تدعم هذا الاسم في Permissions API — لا مشكلة
      }
    }

    // تسجيل periodic sync (إن كان مدعوم)
    if ('periodicSync' in reg) {
      try {
        // minInterval: 24 ساعة بالملّي ثانية
        await reg.periodicSync.register('daily-300', { minInterval: 24 * 60 * 60 * 1000 });
        console.log('registered periodicSync daily-300');
        return true;
      } catch (err) {
        console.warn('periodicSync.register failed', err);
      }
    } else {
      console.log('periodicSync not supported in this browser');
    }
  } catch (err) {
    console.warn('SW register failed', err);
  }
  return false;
}

// تسجيل SW من virtual:pwa-register (يظل مفيد إذا تستخدم Vite/Vercel PWA tooling)
registerSW({
  onRegistered: (registration) => {
    // نجرّب تسجيل periodicSync ثم fallback إلى in-page scheduler
    (async () => {
      const hasNotif = await requestNotificationPermission();
      if (!hasNotif) console.warn('Notification permission not granted; local notifications will not appear');

      const ok = await registerAndTryPeriodicSync();
      if (!ok) {
        // إذا لم يعمل periodicSync أو غير مدعوم - ابدأ fallback داخل الصفحة
        startInPageScheduler();
      }
    })();
  },
});

// render app
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Analytics />
  </BrowserRouter>,
);
