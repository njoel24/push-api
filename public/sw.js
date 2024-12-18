
self.addEventListener("install", () => {
  console.log("Service worker installed.");
});

self.addEventListener("activate", () => {
  console.log("Service worker activated.");
});

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  // Extract data from the event
  let data = { title: "Default Title", body: "Default body" };
  if (event.data) {
    data = event.data.json();
  }

  console.log("Notification Data:", data);

  // Show the notification
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icon.png", // Replace with a valid path to an icon
    badge: "/icon.png",
  });
});