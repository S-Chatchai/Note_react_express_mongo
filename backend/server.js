require('dotenv').config(); // MUST be at the very top
const express = require('express');
const dns = require('node:dns');
const mongoose = require('mongoose');
const cors = require('cors');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(cors());
app.use(express.json());

// Replace <password> and <cluster> with your Atlas details
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Could not connect", err));

// Create a Schema and Model
const NoteSchema = new mongoose.Schema({
  content: String
});
const Note = mongoose.model('Note', NoteSchema);

// GET all notes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// POST a new note
app.post('/api/notes', async (req, res) => {
  const newNote = new Note({ content: req.body.text });
  await newNote.save();
  res.json(newNote);
});

// DELETE a single note by ID
app.delete('/api/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

// DELETE all notes (Clear All)
app.delete('/api/notes', async (req, res) => {
  await Note.deleteMany({});
  res.json({ message: "All notes cleared" });
});

// This allows Render to set the port automatically
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});