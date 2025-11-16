import React from 'react'
import Lottie from 'lottie-react'
import animationData from '../assets/ayurveda-hero.json'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1>Ojasritu — Ayurveda for Modern Life</h1>
          <p>Natural products, authentic practices, and guided wellness plans.</p>
        </div>
        <div className="hero-anim">
          <Lottie animationData={animationData} loop />
        </div>
      </div>
    </section>
  )
}
