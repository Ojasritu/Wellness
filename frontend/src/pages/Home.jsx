import React from 'react'
import Hero from '../components/Hero'
import Lottie from 'lottie-react'
import animationData from '../assets/ayurveda-hero.json'
import Chatbot from '../components/Chatbot'
import { useTranslation } from 'react-i18next'
import './Home.css'

function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <Hero />
      <section className="container intro">
        <h2>{t('welcome')}</h2>
        <p>Discover our premium wellness products, expert guidance and timeless Ayurvedic wisdom.</p>
      </section>

      {/* Ancient Ayurveda animation section (replaces video gallery) */}
      <section className="ancient-section">
        <div className="container ancient-inner">
          <div className="ancient-text">
            <h3>प्राचीन आयुर्वेद - Ancient Wisdom</h3>
            <p>Experience ancient Ayurvedic principles brought to life with immersive animation and gentle visuals inspired by classical Sanskrit manuscripts.</p>
          </div>
          {/* Side box with Chanakya meditation image */}
          <div className="ancient-sidebox" aria-hidden="false">
            <img
              src="/chanakya.svg"
              alt="Chanakya - Ancient Ayurveda Sage"
              className="chanakya-img"
              loading="lazy"
            />
            <p className="chanakya-caption">चाणक्य</p>
          </div>
          <div className="ancient-anim">
            <Lottie animationData={animationData} loop />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Wellness Products</h2>
          <p className="section-subtitle">Handpicked Ayurvedic remedies for holistic health</p>
          <div className="featured-grid">
            <div className="featured-card">
              <div className="card-icon">🌿</div>
              <h3>Herbal Supplements</h3>
              <p>Pure, organic formulations from ancient recipes</p>
            </div>
            <div className="featured-card">
              <div className="card-icon">🧘</div>
              <h3>Wellness Oils</h3>
              <p>Therapeutic oils for balance and rejuvenation</p>
            </div>
            <div className="featured-card">
              <div className="card-icon">💆</div>
              <h3>Personal Care</h3>
              <p>Natural skincare and body care products</p>
            </div>
            <div className="featured-card">
              <div className="card-icon">🍵</div>
              <h3>Herbal Teas</h3>
              <p>Blended for specific dosha balancing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Community Says</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Ojasritu changed my wellness journey. The products are authentic and the guidance is invaluable."</p>
              <h4>Priya Sharma</h4>
              <span>Delhi, India</span>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The dosha analyzer helped me understand my body constitution perfectly. Highly recommended!"</p>
              <h4>Arun Kumar</h4>
              <span>Mumbai, India</span>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best Ayurvedic products online. Fast shipping and excellent customer service."</p>
              <h4>Neha Patel</h4>
              <span>Bangalore, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2>Ready to Transform Your Wellness?</h2>
          <p>Join thousands of satisfied customers discovering authentic Ayurveda</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Explore Products</button>
            <button className="cta-btn secondary">Book a Consultation</button>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  )
}

export default Home