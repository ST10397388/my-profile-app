import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Please check your MONGODB_URI in .env file');
  });

// Profile Schema
const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  title: { type: String, default: 'Software Developer' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

// Routes

// GET profile
app.get('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Create default profile if none exists
      profile = await Profile.create({
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Developer',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE profile
app.put('/api/profile', async (req, res) => {
  try {
    const { firstName, lastName, title, imageUrl } = req.body;
    
    let profile = await Profile.findOne();
    
    if (profile) {
      // Update existing profile
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.title = title;
      profile.imageUrl = imageUrl;
      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({ firstName, lastName, title, imageUrl });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});