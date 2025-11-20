import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailField, setEmailField] = useState('')

  useEffect(() => {
    fetch('/api/profile/', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '')
      setLastName(profile.last_name || '')
      setEmailField(profile.email || '')
    }
  }, [profile])

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
      if (firstName) form.append('first_name', firstName)
      if (lastName) form.append('last_name', lastName)
      if (emailField) form.append('email', emailField)
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
    <div className="profile-page container-grid">
      <aside className="profile-side">
        <div className="avatar-box">
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">{(profile.username || '').charAt(0).toUpperCase()}</div>
          )}
          <div className="avatar-actions">
            <input id="avatar-upload" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
            {profile.avatar && (
              <button className="btn btn-danger" onClick={async () => {
                const res = await fetch('/api/profile/avatar/', { method: 'DELETE', credentials: 'include' })
                if (res.ok) setProfile({...profile, avatar: null})
              }}>Delete avatar</button>
            )}
          </div>
        </div>
        <div className="profile-links">
          <button className="btn" onClick={() => navigate('/profile')}>Profile</button>
          <Link to="/orders">My Orders</Link>
          <Link to="/rebookings">My Bookings</Link>
        </div>
      </aside>

      <section className="profile-main">
        <h2>Your Profile</h2>
        <div className="field-row">
          <label>Username</label>
          <div className="field-value">{profile.username}</div>
        </div>

        <div className="field-row">
          <label>First name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="field-row">
          <label>Last name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="field-row">
          <label>Email</label>
          <input value={emailField} onChange={(e) => setEmailField(e.target.value)} />
        </div>

        <div className="field-row">
          <label>Phone</label>
          <input value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
        </div>

        <div className="field-row">
          <label>Bio</label>
          <textarea value={profile.bio || ''} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>

        {profile.orders && (
          <div className="history">
            <h3>Orders</h3>
            <ul>
              {profile.orders.map((o) => (
                <li key={o.id}><Link to={`/orders/${o.id}`}>{o.order_id || o.id} — ₹{o.final_amount} — {o.status}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {profile.rebookings && (
          <div className="history">
            <h3>Bookings</h3>
            <ul>
              {profile.rebookings.map((r) => (
                <li key={r.id}>{r.consultation_type} — {r.scheduled_date} — {r.status}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}

export default Profile
