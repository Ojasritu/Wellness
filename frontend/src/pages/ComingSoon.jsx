import React from 'react'
import './ComingSoon.css'

const ComingSoon = () => {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        {/* Decorative Elements */}
        <div className="decoration-top-left">
          <div className="leaf leaf-1">🍃</div>
          <div className="leaf leaf-2">🌿</div>
          <div className="fern fern-1">🌱</div>
        </div>

        {/* Main Content */}
        <div className="coming-soon-content">
          {/* Lotus Flower */}
          <div className="lotus-container">
            <div className="lotus">
              <div className="lotus-petal lotus-petal-1"></div>
              <div className="lotus-petal lotus-petal-2"></div>
              <div className="lotus-petal lotus-petal-3"></div>
              <div className="lotus-petal lotus-petal-4"></div>
              <div className="lotus-petal lotus-petal-5"></div>
              <div className="lotus-center"></div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="coming-soon-title">Coming Soon</h1>
          <p className="coming-soon-subtitle">
            Ancient Ayurveda & Nature
          </p>
          <p className="coming-soon-date">
            Launching 2026
          </p>

          {/* Description */}
          <p className="coming-soon-description">
            We are crafting something extraordinary for you. 
            Our new collection brings together the ancient wisdom of Ayurveda 
            with modern wellness solutions.
          </p>

          {/* Subscribe Form */}
          <div className="subscribe-section">
            <h3>Be the First to Know</h3>
            <form className="subscribe-form" onSubmit={(e) => {
              e.preventDefault()
              alert('Thank you for your interest! We will notify you soon.')
            }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="subscribe-input"
              />
              <button type="submit" className="subscribe-btn">
                Notify Me
              </button>
            </form>
          </div>

          {/* Features Preview */}
          <div className="features-preview">
            <div className="feature-item">
              <span className="feature-icon">🌿</span>
              <p>100% Organic</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🧘</span>
              <p>Authentic Ayurveda</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💚</span>
              <p>Natural Care</p>
            </div>
          </div>

          {/* Navigation Link */}
          <div className="back-to-home">
            <a href="/">← Back to Home</a>
          </div>
        </div>

        {/* Decorative Elements - Right */}
        <div className="decoration-bottom-right">
          <div className="leaf leaf-3">🍃</div>
          <div className="leaf leaf-4">🌿</div>
          <div className="fern fern-2">🌱</div>
        </div>

        {/* Watercolor Background Effect */}
        <div className="watercolor-bg watercolor-1"></div>
        <div className="watercolor-bg watercolor-2"></div>
        <div className="watercolor-bg watercolor-3"></div>
      </div>
    </div>
  )
}

export default ComingSoon
