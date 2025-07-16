const express = require('express');
const app = express();

app.get('/health', (req, res) => res.send('Still working... on *my* machine 🧃'));

app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

