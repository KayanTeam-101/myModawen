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
      icon: "/logo192.png",
      requireInteraction: true
    });
  }
});
