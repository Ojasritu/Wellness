import React from 'react'
import './About.css'

const About = () => {
  const acharyas = [
    { id: 1, name: 'Acharya Charaka', role: 'Founder of Charaka Samhita', era: '100 BCE', icon: '🧑‍⚕️' },
    { id: 2, name: 'Acharya Sushruta', role: 'Founder of Sushruta Samhita', era: '600 BCE', icon: '🩺' },
    { id: 3, name: 'Acharya Vagbhata', role: 'Author of Ashtanga Hridaya', era: '600 CE', icon: '📚' },
    { id: 4, name: 'Acharya Bhava Mishra', role: 'Bhava Prakasha Author', era: '1600 CE', icon: '🌿' },
  ]

  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <div className="container">
          <h1>About Ojasritu</h1>
          <p>Bridging Ancient Wisdom with Modern Wellness</p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>At Ojasritu, we are dedicated to bringing authentic Ayurvedic wisdom to modern life. Our mission is to help individuals discover their natural constitution (Prakriti), understand their unique health profile, and restore balance through scientifically validated natural remedies.</p>
              <p>We believe that true wellness comes not from treating symptoms, but from preventing disease by maintaining the equilibrium of the three doshas: Vata, Pitta, and Kapha.</p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Authenticity</h3>
              <p>We source only genuine, certified organic Ayurvedic herbs and formulations from trusted suppliers.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔬</div>
              <h3>Science-Backed</h3>
              <p>Each product is tested for purity, potency, and safety according to international quality standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">♻️</div>
              <h3>Sustainability</h3>
              <p>We practice ethical sourcing and eco-friendly packaging to protect our planet for future generations.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Holistic Care</h3>
              <p>We believe in treating the whole person—body, mind, and spirit—for lasting wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Acharyas Section */}
      <section className="acharyas-section">
        <div className="container">
          <h2>The Great Acharyas</h2>
          <p className="acharyas-intro">We honor the ancient masters whose wisdom guides our practice</p>
          <div className="acharyas-grid">
            {acharyas.map(acharya => (
              <div key={acharya.id} className="acharya-card">
                <div className="acharya-icon">{acharya.icon}</div>
                <h3>{acharya.name}</h3>
                <p className="acharya-role">{acharya.role}</p>
                <span className="acharya-era">{acharya.era}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Premium Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Organic Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <h2>Why Choose Ojasritu?</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h3>Expert Consultation</h3>
                <p>Get personalized guidance from certified Ayurvedic practitioners</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h3>Premium Quality</h3>
                <p>All products tested and certified for purity and effectiveness</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h3>Fast Delivery</h3>
                <p>Free shipping on orders above ₹500 within India</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h3>Money-Back Guarantee</h3>
                <p>30-day refund guarantee if you're not completely satisfied</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
