import React from 'react'
import Hero from '../components/Hero'
import Lottie from 'lottie-react'
import animationData from '../assets/ayurveda-hero.json'
import Chatbot from '../components/Chatbot'
import { useTranslation } from 'react-i18next'

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
          <div className="ancient-anim">
            <Lottie animationData={animationData} loop />
          </div>
        </div>
      </section>
      <Chatbot />
    </div>
  )
}

export default Home