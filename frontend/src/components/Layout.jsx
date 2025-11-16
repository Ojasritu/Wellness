import React from 'react'
import { Link } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            Ojasritu Wellness
          </Link>
          <div className="nav-links">
            <Link to="/products">Products</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/wellness">Wellness Centre</Link>
            <Link to="/acharyas">Acharyas</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="nav-actions">
            <select onChange={(e) => { window.localStorage.setItem('lang', e.target.value); window.location.reload() }} defaultValue={window.localStorage.getItem('lang') || 'en'}>
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
            <a className="btn btn-ghost" href="https://wa.me/918305569539" target="_blank" rel="noreferrer">WhatsApp</a>
            <Link to="/login" className="btn">Login</Link>
          </div>
        </div>
      </nav>
      <main className="container">
        {children}
      </main>
      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} Ojasritu Wellness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout