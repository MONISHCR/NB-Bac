const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Monish:Monish21@cluster0.mtbgshr.mongodb.net/noticesDB?retryWrites=true&w=majority', {

});


const noticeSchema = new mongoose.Schema({
  content: String,
  link: String,
  deadline: String,
}, { collection: 'notices' });  // Explicitly specify the collection name

const Notice = mongoose.model('Notice', noticeSchema);

app.get('/notices', async (req, res) => {
  const notices = await Notice.find();
  res.json(notices);
});

app.post('/notices', async (req, res) => {
  const notice = new Notice(req.body);
  await notice.save();
  res.status(201).json(notice);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
