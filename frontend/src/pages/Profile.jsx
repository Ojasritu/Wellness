import React from 'react'

export default function Profile() {
  return (
    <div className="container profile">
      <h2>My Profile</h2>
      <p>Edit your profile, view orders and payment info (demo).</p>
      <button onClick={() => alert('Edit profile dialog (demo)')}>Edit Profile</button>
    </div>
  )
}
