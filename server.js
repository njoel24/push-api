const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Generate VAPID keys (do this once and replace below)
const vapidKeys = {
  publicKey: "BJanmvuZ3760F29MB5L9QH-JUOZhrZ9qt_BJNqRcZefKrV4g4b5pKsmIms776La_J9MGtZfFWIOc3U1TGQHf-Fw",
  privateKey: "49oW1uESzzeKizg1WKCPGYPgqKblZrSRm3Rb0VFBh_4",
};

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  "mailto:example@yourdomain.com", // Your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions in memory (use a DB in production)
let subscriptions = [];

// Endpoint to save the subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription received" });
});

// Endpoint to trigger push notifications
app.post("/sendNotification", (req, res) => {
  const payload = JSON.stringify({ title: "Push Notification", body: "This is a test notification.", actions: [{ action: "open", title: "Open App" }], });
  console.log("Sending payload:", payload);
  // Send notification to all subscribers
  subscriptions.forEach((sub) => {
    webpush
      .sendNotification(sub, payload)
      .then(() => console.log("Notification sent"))
      .catch((err) => console.error("Error sending notification", err));
  });

  res.json({ message: "Notifications sent" });
});

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
