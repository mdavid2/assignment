// test-server.js
const express = require('express');
const app = express();

app.get('/health', (req, res) => res.send('Still working... on *my* machine 🧃'));
app.get('/status', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

module.exports = app;
