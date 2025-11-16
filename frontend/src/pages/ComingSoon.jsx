import React from 'react'

export default function ComingSoon({ title='Feature' }) {
  return (
    <div className="container coming-soon">
      <h2>{title} — Coming Soon</h2>
      <p>We're working hard to bring this feature online. Stay tuned!</p>
    </div>
  )
}
