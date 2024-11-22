const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const JWT_SECRET = 'your_super_secret_key_here'; // Replace with an environment variable in production

app.use(cors());
app.use(express.json());

// Middleware to block suspicious user agents
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  if (/python|curl|wget/i.test(userAgent)) {
    return res.status(403).send('Bots are not allowed');
  }
  next();
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied. No Token Provided.');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token.');
    req.user = user;
    next();
  });
};

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Monish:Monish21@cluster0.mtbgshr.mongodb.net/noticesDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noticeSchema = new mongoose.Schema(
  {
    content: String,
    link: String,
    deadline: String,
  },
  { collection: 'notices' } // Explicitly specify the collection name
);

const Notice = mongoose.model('Notice', noticeSchema);

// Route to authenticate and get token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace with real user validation logic
  if (username === 'admin' && password === 'csm321$') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).send('Invalid credentials.');
});

// Protected route to get notices
app.get('/notices', authenticateToken, async (req, res) => {
  const notices = await Notice.find();
  res.json(notices);
});

// Protected route to add a new notice
app.post('/notices', authenticateToken, async (req, res) => {
  const notice = new Notice(req.body);
  await notice.save();
  res.status(201).json(notice);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
