
self.addEventListener("install", () => {
  console.log("Service worker installed.");
});

self.addEventListener("activate", () => {
  console.log("Service worker activated.");
});

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  let data = { title: "Default Title", body: "Default Body", actions: [] };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error("Error parsing push data:", err);
  }

  const options = {
    body: data.body,
    icon: "icon.png", // Adjust to your icon path
    actions: data.actions,
    data: {
      url: "http://localhost:3000", // Replace with your app's URL
    },
    requireInteraction: true, // Keeps the notification visible until the user interacts
  };

  self.registration.showNotification(data.title, options);
});

// Handle notification button click events
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close(); // Close the notification

  if (event.action === "open") {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
