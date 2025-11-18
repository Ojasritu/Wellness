import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AyurvedicChatbot from './components/AyurvedicChatbot'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Blog from './pages/Blog'
import Profile from './pages/Profile'
import Wellness from './pages/Wellness'
import Acharyas from './pages/Acharyas'
import ComingSoon from './pages/ComingSoon'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/acharyas" element={<Acharyas />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
        <AyurvedicChatbot />
      </Layout>
    </Router>
  )
}

export default App