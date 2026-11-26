// Aviso no celular/computador das notificações da Romance Favorita
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

function urlCompleta(u) {
  const base = self.registration.scope;
  try { return new URL(u || "minha-area", base).href; } catch (_) { return base + "minha-area"; }
}

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (_) { d = { mensagem: event.data && event.data.text() }; }
  const base = self.registration.scope;
  const opcoes = {
    body: d.mensagem || "Você tem uma nova mensagem.",
    icon: base + "icone-192.png",
    badge: base + "icone-192.png",
    data: { url: urlCompleta(d.url) },
  };
  if (d.tag) { opcoes.tag = d.tag; opcoes.renotify = true; }
  event.waitUntil(self.registration.showNotification(d.titulo || "Romance Favorita", opcoes));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || urlCompleta();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((abertas) => {
      for (const c of abertas) {
        if (c.url.includes("/minha-area") && "focus" in c) {
          return c.focus().then((w) => (w && "navigate" in w && w.url !== url ? w.navigate(url) : w));
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
