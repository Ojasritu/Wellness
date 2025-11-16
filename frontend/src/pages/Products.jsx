import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDosha, setSelectedDosha] = useState(null)
  const [sortBy, setSortBy] = useState('popular')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory, selectedDosha, sortBy, searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories/', {
        credentials: 'include',
      })
      const data = await response.json()
      if (data.results) {
        setCategories(data.results)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8000/api/products/?'
      
      if (selectedCategory) {
        url += `category=${selectedCategory}&`
      }
      if (selectedDosha) {
        url += `dosha_type=${selectedDosha}&`
      }
      if (searchQuery) {
        url += `search=${searchQuery}&`
      }
      
      url += `ordering=${sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? '-price' : '-created_at'}`

      const response = await fetch(url, {
        credentials: 'include',
      })
      const data = await response.json()
      setProducts(data.results || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const doshas = [
    { value: 'vata', label: 'वात / Vata', color: '#00d4ff' },
    { value: 'pitta', label: 'पित्त / Pitta', color: '#ff6b6b' },
    { value: 'kapha', label: 'कफ / Kapha', color: '#51cf66' },
  ]

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <h1 className="products-title">🌿 आयुर्वेदिक उत्पाद / Ayurvedic Products</h1>
        <p className="products-subtitle">
          प्राकृतिक, शुद्ध और प्राचीन विज्ञान से निर्मित उत्पाद
        </p>
      </div>

      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">🔍 Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h3 className="filter-title">📂 Category</h3>
            <div className="filter-options">
              <button
                className={`filter-option ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-option ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dosha Filter */}
          <div className="filter-section">
            <h3 className="filter-title">🧘 Dosha Type</h3>
            <div className="dosha-filter">
              <button
                className={`dosha-filter-btn ${!selectedDosha ? 'active' : ''}`}
                onClick={() => setSelectedDosha(null)}
              >
                All Doshas
              </button>
              {doshas.map((dosha) => (
                <button
                  key={dosha.value}
                  className={`dosha-filter-btn ${selectedDosha === dosha.value ? 'active' : ''}`}
                  onClick={() => setSelectedDosha(dosha.value)}
                  style={{
                    borderColor: selectedDosha === dosha.value ? dosha.color : 'rgba(212, 175, 55, 0.2)',
                  }}
                >
                  {dosha.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-section">
            <h3 className="filter-title">↕️ Sort By</h3>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSelectedCategory(null)
              setSelectedDosha(null)
              setSearchQuery('')
              setSortBy('popular')
            }}
          >
            ✕ Clear All Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          {/* Results Info */}
          <div className="results-info">
            <p className="results-count">
              Showing <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h2>😕 No products found</h2>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </main>
      </div>

      {/* FAQ Section */}
      <section className="products-faq">
        <h2>❓ Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How to choose the right product?</h4>
            <p>
              Use our Dosha Analyzer to identify your body type and get personalized product recommendations.
            </p>
          </div>
          <div className="faq-item">
            <h4>Are products authentic?</h4>
            <p>
              All our products are 100% authentic, sourced directly from certified Ayurvedic practitioners and manufacturers.
            </p>
          </div>
          <div className="faq-item">
            <h4>What is the delivery time?</h4>
            <p>
              We offer free delivery across India. Standard delivery takes 5-7 business days.
            </p>
          </div>
          <div className="faq-item">
            <h4>Can I return products?</h4>
            <p>
              Yes, we have a 30-day return policy for unused and unopened products. Contact our support team for details.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products
