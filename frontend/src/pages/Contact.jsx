import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production, send to backend API
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help. Reach out with any questions about our products or services.</p>
        </div>
      </div>

      <div className="container contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <p>✓ Thank you! We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <aside className="contact-info-section">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Address</h3>
            <p>123 Wellness Lane<br />New Delhi, India 110001</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+91 (11) 1234-5678<br />Mon-Fri: 9 AM - 6 PM IST</p>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Email</h3>
            <p>support@ojasritu.com<br />hello@ojasritu.com</p>
          </div>

          <div className="info-card">
            <div className="info-icon">🕐</div>
            <h3>Hours</h3>
            <p>Monday - Friday: 9 AM - 6 PM<br />Saturday: 10 AM - 4 PM<br />Sunday: Closed</p>
          </div>
        </aside>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What are the shipping charges?</h3>
              <p>We offer free shipping on all orders above ₹500. Orders below ₹500 incur a standard shipping charge of ₹49.</p>
            </div>
            <div className="faq-item">
              <h3>How long does delivery take?</h3>
              <p>Standard delivery takes 5-7 business days within India. Express delivery (2-3 days) is available in major cities.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>Yes, we offer a 30-day money-back guarantee on all products. Contact us if you're not satisfied.</p>
            </div>
            <div className="faq-item">
              <h3>Are your products certified organic?</h3>
              <p>All our products are sourced from certified organic suppliers and tested for purity and quality.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
