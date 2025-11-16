import React from 'react'
import Hero from '../components/Hero'
import VideoGallery from '../components/VideoGallery'
import Chatbot from '../components/Chatbot'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <Hero />
      <section className="container intro">
        <h2>{t('welcome')}</h2>
        <p>Discover our premium wellness products, expert guidance and Ayurvedic videos.</p>
      </section>
      <VideoGallery />
      <Chatbot />
    </div>
  )
}

export default Home