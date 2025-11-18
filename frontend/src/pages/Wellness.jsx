import React from 'react'
import './CommonComingSoon.css'

// Fern SVG Component
const FernDecoration = () => (
  <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" className="fern-svg">
    <defs>
      <linearGradient id="fernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#d4af37', stopOpacity: 0.9}} />
        <stop offset="100%" style={{stopColor: '#a8a8a8', stopOpacity: 0.6}} />
      </linearGradient>
    </defs>
    <path d="M 100 10 Q 90 40 85 70 Q 80 100 78 130 M 100 10 Q 110 40 115 70 Q 120 100 122 130" stroke="url(#fernGrad)" strokeWidth="2" fill="none" />
    <path d="M 85 50 Q 75 55 70 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 85 50 Q 95 55 100 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 90 80 Q 80 85 75 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 90 80 Q 100 85 105 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 115 50 Q 125 55 130 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 115 50 Q 105 55 100 65" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 110 80 Q 120 85 125 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 110 80 Q 100 85 95 95" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
    <path d="M 78 150 L 70 170 M 78 150 L 85 170 M 122 150 L 130 170 M 122 150 L 115 170" stroke="url(#fernGrad)" strokeWidth="1.5" fill="none" />
  </svg>
)

// Lotus SVG Component
const LotusDecoration = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="lotus-svg">
    <defs>
      <radialGradient id="lotusGrad">
        <stop offset="0%" style={{stopColor: '#f0d9a0', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#d4af37', stopOpacity: 0.8}} />
      </radialGradient>
    </defs>
    {/* Petals */}
    <ellipse cx="100" cy="60" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.9" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.85" transform="rotate(72 100 100)" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.8" transform="rotate(144 100 100)" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.85" transform="rotate(216 100 100)" />
    <ellipse cx="145" cy="80" rx="25" ry="40" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(288 100 100)" />
    {/* Center */}
    <circle cx="100" cy="100" r="20" fill="#d4af37" opacity="0.95" />
    <circle cx="100" cy="100" r="15" fill="#f0d9a0" opacity="0.8" />
  </svg>
)

export default function Wellness() {

  return (
    <div className="wellness-wrapper">
      {/* Background with watercolor effects */}
      <div className="wellness-background">
        <div className="watercolor wellness-watercolor-1"></div>
        <div className="watercolor wellness-watercolor-2"></div>
        <div className="watercolor wellness-watercolor-3"></div>
      </div>

      {/* Decorative Elements */}
      <div className="wellness-decorations">
          <div className="fern-decoration wellness-fern"><FernDecoration /></div>
          <div className="lotus-decoration wellness-lotus"><LotusDecoration /></div>
      </div>

      {/* Main Content */}
      <div className="wellness-container">
        {/* Featured Image */}
        <div className="wellness-image-section">
          <img 
            src="data:image/svg+xml,%3Csvg viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230d2941;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23254a5c;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23bg)'/%3E%3Ctext x='960' y='540' font-size='120' font-family='Georgia, serif' fill='%23d4af37' text-anchor='middle' dominant-baseline='middle'%3EWellness Centre%3C/text%3E%3Ctext x='960' y='640' font-size='48' font-family='Georgia, serif' fill='%23c0c0c0' text-anchor='middle' dominant-baseline='middle'%3EHolistic Healing Spaces%3C/text%3E%3C/svg%3E" 
            alt="Wellness Centre Coming Soon" 
            className="wellness-image"
          />
        </div>

        {/* Gold Divider */}
        <div className="gold-divider"></div>

        {/* Content Section */}
        <div className="wellness-content">
          <h1 className="wellness-title">Wellness Centre</h1>
          <p className="wellness-subtitle">Holistic Healing Spaces</p>
          
          <div className="wellness-info">
            <p className="wellness-description">
              Our premium wellness centre brings together ancient Ayurvedic practices with modern therapeutic techniques. 
              Experience personalized consultations, rejuvenating treatments, and guided wellness programs designed for your unique constitution.
            </p>
          </div>

          {/* Features */}
          <div className="wellness-features">
            <div className="feature-card wellness-feature">
              <div className="feature-icon">🌿</div>
              <h3>Personalized Consultations</h3>
              <p>Expert Vaidyas will assess your dosha and create customized wellness plans</p>
            </div>
            <div className="feature-card wellness-feature">
              <div className="feature-icon">💆</div>
              <h3>Therapeutic Treatments</h3>
              <p>Traditional Abhyanga, Shirodhara, and modern healing modalities</p>
            </div>
            <div className="feature-card wellness-feature">
              <div className="feature-icon">🧘</div>
              <h3>Wellness Programs</h3>
              <p>Guided yoga, meditation, and lifestyle transformation courses</p>
            </div>
          </div>

          <div className="coming-year">2026</div>
          
          <button className="wellness-cta-button">
            Get Notified
          </button>
        </div>

        {/* Bottom Divider */}
        <div className="gold-divider"></div>
      </div>
    </div>
  )
}
