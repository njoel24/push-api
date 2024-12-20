const publicVapidKey = "BJanmvuZ3760F29MB5L9QH-JUOZhrZ9qt_BJNqRcZefKrV4g4b5pKsmIms776La_J9MGtZfFWIOc3U1TGQHf-Fw";

// Register Service Worker, Subscribe, and Send Notifications
async function registerServiceWorker() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.error("Notification permission denied!");
    return;
  }

  console.log("Registering service worker...");
  const registration = await navigator.serviceWorker.register("/sw.js");
  console.log("Service Worker registered");

  // Subscribe to push
  setTimeout(async () => {
    console.log("Subscribing to push notifications...");
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  console.log("Push subscription:", subscription);

  // Send subscription to server
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" },
  });
  console.log("Subscription sent to server");
  }, 1000);
  
}

// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Event listeners
document.getElementById("subscribe").addEventListener("click", registerServiceWorker);
document.getElementById("send").addEventListener("click", async () => {
  await fetch("/sendNotification", { method: "POST" });
  console.log("Notification trigger sent to server");
});