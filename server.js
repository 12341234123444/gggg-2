// server.js
// 🌐 Colonization Game Backend — Pass-through relay with timestamping and polling

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 🧠 In-memory buffer to store recent actions (used for polling)
const actionBuffer = [];
const MAX_BUFFER_SIZE = 100;

// ✅ Middleware: parse JSON and enable CORS for your frontend domain
app.use(express.json());
app.use(cors({
  origin: 'https://gggg-8.pagedrop.io', // 🔧 Replace with your actual HTML domain
  credentials: true
}));

// 🕒 Utility: Append ISO timestamp to payload
function addTimestamp(data) {
  return { ...data, timestamp: new Date().toISOString() };
}

// 📡 Broadcast: Store enriched payload in buffer
function broadcastUpdate(data) {
  actionBuffer.push(data);
  if (actionBuffer.length > MAX_BUFFER_SIZE) {
    actionBuffer.shift(); // Remove oldest if buffer is full
  }
}

// 🔧 POST /api/action — receives raw payload, appends timestamp, stores it
app.post('/api/action', (req, res) => {
  const payload = req.body;
  const enriched = addTimestamp(payload);
  broadcastUpdate(enriched);
  res.json({ status: 'OK' });
});

// 🔍 GET /api/updates — returns recent actions for polling clients
app.get('/api/updates', (req, res) => {
  const latest = actionBuffer[actionBuffer.length - 1];
  res.json({ message: latest ? `${latest.action} by ${latest.username}` : 'No recent actions' });
});

// 🧾 POST /api/register — stores player identity (can be expanded later)
app.post('/api/register', (req, res) => {
  const player = req.body;
  console.log("Registered player:", JSON.stringify(player));
  res.json({ status: 'Registered' });
});

// ❤️ GET / — Health check route
app.get('/', (req, res) => {
  res.send('✅ Colonization server is live and listening');
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Colonization server running on port ${PORT}`);
});
