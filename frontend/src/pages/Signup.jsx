import React from 'react'

export default function Signup() {
  return (
    <div className="auth container">
      <h2>Create Account</h2>
      <form onSubmit={(e) => { e.preventDefault(); alert('Demo signup: Thank you for signing up!') }}>
        <label>Full name</label>
        <input name="name" required />
        <label>Email</label>
        <input type="email" name="email" required />
        <label>Mobile</label>
        <input name="mobile" />
        <label>Password</label>
        <input type="password" name="password" required />
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}
