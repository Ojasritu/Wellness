import React, { useState } from 'react'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate login - in production, call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Login:', { email, password })
      // Success message
      setEmail('')
      setPassword('')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-brand">
          <div className="brand-content">
            <h1>Ojasritu Wellness</h1>
            <p className="brand-tagline">प्राचीन आयुर्वेद - आधुनिक जीवन</p>
            <p className="brand-subtitle">Ancient Wisdom for Modern Living</p>
            
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">🌿</span>
                <span>100% Organic</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Fast Delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🛡️</span>
                <span>Certified Safe</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💚</span>
                <span>Money-Back Guarantee</span>
              </div>
            </div>

            <div className="brand-slok">
              <p>"शरीरमाद्यं खलु धर्मसाधनम्"</p>
              <span>Health is the foundation of all virtues</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-wrapper">
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Sign in to your Ojasritu account</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider">OR</div>

            <button
              className="google-login"
              onClick={() => {
                // Redirect to Django-allauth Google login URL
                // allauth default endpoint: /accounts/google/login/
                window.location.href = '/accounts/google/login/';
              }}
            >
              <span>🔐</span> Sign in with Google
            </button>

            <div className="signup-link">
              Don't have an account? <a href="/signup">Create one</a>
            </div>
          </div>

          <div className="form-footer-text">
            <p>Protected by industry-standard encryption</p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="bg-decoration"></div>
    </div>
  )
}

export default Login
