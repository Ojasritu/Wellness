import React, { useState, useMemo } from 'react'
import './Products.css'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDosha, setSelectedDosha] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  // Sample product data (in production, this comes from API)
  const allProducts = [
    { id: 1, name: 'Ashwagandha Root Powder', category: 'supplements', dosha: 'vata', price: 299, rating: 4.8, image: '🌿' },
    { id: 2, name: 'Brahmi Oil', category: 'oils', dosha: 'pitta', price: 450, rating: 4.6, image: '🧴' },
    { id: 3, name: 'Neem Face Mask', category: 'skincare', dosha: 'pitta', price: 199, rating: 4.7, image: '💆' },
    { id: 4, name: 'Sesame Oil', category: 'oils', dosha: 'vata', price: 350, rating: 4.9, image: '🧴' },
    { id: 5, name: 'Triphala Powder', category: 'supplements', dosha: 'all', price: 249, rating: 4.8, image: '🌿' },
    { id: 6, name: 'Tulsi Tea', category: 'tea', dosha: 'all', price: 150, rating: 4.7, image: '🍵' },
    { id: 7, name: 'Brahmi Tea', category: 'tea', dosha: 'pitta', price: 140, rating: 4.6, image: '🍵' },
    { id: 8, name: 'Coconut Oil', category: 'oils', dosha: 'pitta', price: 320, rating: 4.8, image: '🧴' },
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
      const doshaMatch = selectedDosha === 'all' || product.dosha === selectedDosha || product.dosha === 'all'
      const searchMatch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())
      return categoryMatch && doshaMatch && searchMatch
    })

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [selectedCategory, selectedDosha, searchTerm, sortBy])

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="container">
          <h1>Our Wellness Products</h1>
          <p>Handpicked Ayurvedic remedies for your complete wellness journey</p>
        </div>
      </div>

      <div className="container products-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-options">
              <label>
                <input type="radio" name="category" value="all" checked={selectedCategory === 'all'} onChange={(e) => setSelectedCategory(e.target.value)} />
                All Products
              </label>
              <label>
                <input type="radio" name="category" value="supplements" checked={selectedCategory === 'supplements'} onChange={(e) => setSelectedCategory(e.target.value)} />
                Supplements
              </label>
              <label>
                <input type="radio" name="category" value="oils" checked={selectedCategory === 'oils'} onChange={(e) => setSelectedCategory(e.target.value)} />
                Oils
              </label>
              <label>
                <input type="radio" name="category" value="skincare" checked={selectedCategory === 'skincare'} onChange={(e) => setSelectedCategory(e.target.value)} />
                Skincare
              </label>
              <label>
                <input type="radio" name="category" value="tea" checked={selectedCategory === 'tea'} onChange={(e) => setSelectedCategory(e.target.value)} />
                Herbal Teas
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h3>Dosha</h3>
            <div className="filter-options">
              <label>
                <input type="radio" name="dosha" value="all" checked={selectedDosha === 'all'} onChange={(e) => setSelectedDosha(e.target.value)} />
                All Doshas
              </label>
              <label>
                <input type="radio" name="dosha" value="vata" checked={selectedDosha === 'vata'} onChange={(e) => setSelectedDosha(e.target.value)} />
                Vata 🌬️
              </label>
              <label>
                <input type="radio" name="dosha" value="pitta" checked={selectedDosha === 'pitta'} onChange={(e) => setSelectedDosha(e.target.value)} />
                Pitta 🔥
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="products-section">
          <div className="products-info">
            <p>{filteredProducts.length} products found</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">{product.image}</div>
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    {'⭐'.repeat(Math.floor(product.rating))} ({product.rating})
                  </div>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
