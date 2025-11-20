import React, { useEffect, useState } from 'react'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    fetch('/api/profile/', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Fetch orders and rebookings for history
    fetch('/api/orders/', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProfile((p) => ({...p, orders: data.results || data})))
      .catch(() => {})
    fetch('/api/rebookings/', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProfile((p) => ({...p, rebookings: data.results || data})))
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const form = new FormData()
      if (profile.phone) form.append('phone', profile.phone)
      if (profile.bio) form.append('bio', profile.bio)
      if (avatarFile) form.append('avatar', avatarFile)

      const res = await fetch('/api/profile/', {
        method: 'PUT',
        credentials: 'include',
        body: form,
      })
      const data = await res.json()
      setProfile(data)
      alert('Profile updated')
    } catch (err) {
      console.error(err)
      alert('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading profile...</div>
  if (!profile) return <div>Please login to view your profile.</div>

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      {profile.orders && (
        <div>
          <h3>Orders</h3>
          <ul>
            {profile.orders.map((o) => (
              <li key={o.id}>{o.order_id || o.id} — {o.final_amount} — {o.status}</li>
            ))}
          </ul>
        </div>
      )}
      {profile.rebookings && (
        <div>
          <h3>Bookings</h3>
          <ul>
            {profile.rebookings.map((r) => (
              <li key={r.id}>{r.consultation_type} — {r.scheduled_date} — {r.status}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <strong>Username:</strong> {profile.username}
      </div>
      <div>
        <strong>Email:</strong> {profile.email}
      </div>
      <div>
        <label>Phone</label>
        <input value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
      </div>
      <div>
        <label>Bio</label>
        <textarea value={profile.bio || ''} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
      </div>
      <div>
        <label>Avatar</label>
        {profile.avatar && <img src={profile.avatar} alt="avatar" style={{width:80,height:80,borderRadius:40}} />}
        <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
      </div>
      <div>
        <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
    </div>
  )
}

export default Profile
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
