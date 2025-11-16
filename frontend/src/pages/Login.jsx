import React from 'react'

export default function Login() {
  return (
    <div className="auth container">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Email</label>
        <input type="email" name="email" required />
        <label>Password</label>
        <input type="password" name="password" required />
        <button type="submit">Login</button>
      </form>
      <div className="oauth">
        <p>Or login with</p>
        <button onClick={() => window.alert('Google OAuth demo — configure via README')}>Google</button>
      </div>
    </div>
  )
}
