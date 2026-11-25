// Aviso no celular/computador das notificações da Romance Favorita
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (_) { d = { mensagem: event.data && event.data.text() }; }
  const base = self.registration.scope;
  event.waitUntil(
    self.registration.showNotification(d.titulo || "Romance Favorita", {
      body: d.mensagem || "Você tem uma nova mensagem.",
      icon: base + "icone-192.png",
      badge: base + "icone-192.png",
      data: { url: d.url || base + "minha-area" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope + "minha-area";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((abertas) => {
      for (const c of abertas) {
        if (c.url.includes("/minha-area") && "focus" in c) return c.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
