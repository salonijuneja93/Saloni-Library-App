
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => console.log('mongodb+srv://salonijuneja93:Abc1234@saloni09.6xpr2.mongodb.net/?retryWrites=true&w=majority&appName=Saloni09'));
mongoose.connection.on('error', (err) => console.log('MongoDB Connection Error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, default: 'Unread' },
});

const Book = mongoose.model('Book', bookSchema);

// API Routes
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, status } = req.body;
    if (!title || !author) return res.status(400).send('Title and Author are required');
    const newBook = new Book({ title, author, status });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
