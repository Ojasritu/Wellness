import React from 'react'

const demoPosts = [
  { id: 1, title: 'Ayurvedic Morning Routine', excerpt: 'Start your day the Ayurvedic way...' },
  { id: 2, title: 'Herbal Oils 101', excerpt: 'Guide to herbal oils and uses.' },
]

export default function Blog() {
  return (
    <div className="container blog">
      <h2>Blog</h2>
      <div className="posts">
        {demoPosts.map((p) => (
          <article key={p.id} className="post">
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <a href="#">Read more</a>
          </article>
        ))}
      </div>
    </div>
  )
}
