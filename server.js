 const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const Paste = require('./models/model');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const pasteRoutes = require('./routes/pastes');

app.use(express.json());
app.use(cors());
app.use('/api', pasteRoutes);


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.get('/p/:id', (req, res) => {
    
    const paste = Paste.findById(req.params.id);
    if (!paste) {
        return res.status(404).send('Paste not found');
    }

  res.send(`Content: ${paste.content}`);
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});