import { useState } from 'react'
import './App.css'

function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    title: 'Software Developer',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  })

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="app">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

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
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App