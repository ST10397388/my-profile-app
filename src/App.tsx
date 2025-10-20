import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Profile {
  _id?: string;
  firstName: string;
  lastName: string;
  title: string;
  imageUrl: string;
}

const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5001/api'
  : '/.netlify/functions/api';
function App() {
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: '',
    title: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/profile`);
      setProfile(response.data);
      setMessage('');
      console.log('✅ Profile loaded from database');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('⚠️ Could not connect to database. Make sure backend is running on port 5001.');
      // Fallback to local data
      setProfile({
        firstName: 'John',
        lastName: 'Doe', 
        title: 'Software Developer',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setMessage('💾 Saving to database...');
      const response = await axios.put(`${API_BASE_URL}/profile`, profile);
      setProfile(response.data);
      setIsEditing(false);
      setMessage('✅ Profile saved to MongoDB!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('❌ Failed to save to database. Check backend connection.');
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setMessage('');
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">Loading from database... ⏳</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="profile-image">
          <img 
            src={profile.imageUrl} 
            alt="Profile" 
          />
          {isEditing && (
            <input
              type="text"
              placeholder="Image URL"
              value={profile.imageUrl}
              onChange={(e) => setProfile({...profile, imageUrl: e.target.value})}
              className="edit-input"
            />
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                className="edit-input"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                className="edit-input"
              />
              <input
                type="text"
                placeholder="Title"
                value={profile.title}
                onChange={(e) => setProfile({...profile, title: e.target.value})}
                className="edit-input"
              />
              <div className="button-group">
                <button className="save-btn" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save to Database'}
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>{profile.firstName} {profile.lastName}</h1>
              <p>{profile.title}</p>
              <div className="data-source">
                <small>💾 Data stored in MongoDB Cloud</small>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;