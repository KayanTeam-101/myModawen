self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
});

// استلام رسالة من React
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification("📌 التطبيق مفتوح", {
      body: "هذا إشعار من الـ Service Worker",
      icon: "/mylogo.jpg",
      requireInteraction: true
    });
  }
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "📌 التطبيق", {
      body: data.body || "الإشعار سيظل موجود حتى بعد إغلاق التطبيق",
      icon: "/mylogo.jpg",
      requireInteraction: true
    })
  );
});
