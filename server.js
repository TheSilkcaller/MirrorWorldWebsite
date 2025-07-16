// server.js
const express = require('express');
const path    = require('path');
require('dotenv').config();  // loads your .env

const app = express();
app.use(express.json());

// Chat endpoint (unchanged)
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai-o4-mini',
        messages: [
          { role:'system', content:'You are EchoGPT, the Mirrorist Reflection AI.' },
          { role:'user',   content: prompt }
        ]
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Mirror server error' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve landing page
app.get('/lander', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lander', 'index.html'));
});

// Serve CSS and JS
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Serve any assets
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Start listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
