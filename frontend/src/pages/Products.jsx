import React, { useState, useMemo } from 'react'
import './Products.css'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  // Sample product data (in production, this comes from API)
  const allProducts = [
    { id: 1, name: 'Ashwagandha Root Powder', category: 'supplements', price: 299, rating: 4.8, image: '🌿' },
    { id: 2, name: 'Brahmi Oil', category: 'oils', price: 450, rating: 4.6, image: '🧴' },
    { id: 3, name: 'Morning Routine Kit', category: 'daily-routine', price: 599, rating: 4.7, image: '📦' },
    { id: 4, name: 'Sesame Oil Massage', category: 'oils', price: 350, rating: 4.9, image: '🧴' },
    { id: 5, name: 'Triphala Powder', category: 'supplements', price: 249, rating: 4.8, image: '🌿' },
    { id: 6, name: 'Evening Wellness Set', category: 'daily-routine', price: 799, rating: 4.7, image: '📦' },
    { id: 7, name: 'Brahmi Supplement', category: 'supplements', price: 280, rating: 4.6, image: '🌿' },
    { id: 8, name: 'Coconut Oil Premium', category: 'oils', price: 320, rating: 4.8, image: '🧴' },
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
      const searchMatch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())
      return categoryMatch && searchMatch
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
  }, [selectedCategory, searchTerm, sortBy])

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
                <input type="radio" name="category" value="daily-routine" checked={selectedCategory === 'daily-routine'} onChange={(e) => setSelectedCategory(e.target.value)} />
                Daily Routine
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
