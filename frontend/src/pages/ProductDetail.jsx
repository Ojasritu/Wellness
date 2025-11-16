import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams()
  // In a real app, fetch product by id from /api/products/:id
  const demo = { id, name: 'Demo Herbal Capsule', price: 199, description: 'Demo product description.' }

  function buyDemo() {
    // Razorpay demo checkout (instructions in README)
    const rkey = window.__RAZORPAY_KEY__ || 'rzp_test_XXXXXXXXXXXX'
    const options = {
      key: rkey,
      amount: demo.price * 100,
      currency: 'INR',
      name: demo.name,
      description: demo.description,
      handler: function (response) {
        alert('Payment success (demo). Payment id: ' + response.razorpay_payment_id)
      },
      prefill: { email: '', contact: '' },
    }

    const loadAndOpen = () => {
      if (window.Razorpay) {
        const r = new window.Razorpay(options)
        r.open()
      } else {
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => {
          const r = new window.Razorpay(options)
          r.open()
        }
        document.body.appendChild(s)
      }
    }

    loadAndOpen()
  }

  return (
    <div className="container product-detail">
      <h2>{demo.name}</h2>
      <p>{demo.description}</p>
      <p className="price">₹{demo.price}</p>
      <div className="actions">
        <button onClick={buyDemo}>Buy Now</button>
        <button disabled title="Will be enabled after official product launch">Add to cart</button>
      </div>
    </div>
  )
}
