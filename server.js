const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Monish:Monish21@cluster0.mtbgshr.mongodb.net/noticesDB?retryWrites=true&w=majority', {
});
console.log(`mmm`);

// Define a schema for the notices
const noticeSchema = new mongoose.Schema({
  content: String,
  link: String,
  deadline: String,
}, { collection: 'notices' });  // Explicitly specify the collection name

const Notice = mongoose.model('Notice', noticeSchema);

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(limiter); // Apply to all routes

// Middleware to check for an API key for sensitive routes
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === 'aB12#4dEfG8!zT@1sXyZ6w3vvv') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid API key' });
  }
};

// Define routes
app.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices' });
  }
});

// Apply `checkApiKey` middleware to protect the POST route
app.post('/notices', checkApiKey, async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error adding notice' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
