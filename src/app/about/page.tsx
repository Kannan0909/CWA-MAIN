'use client'

import React from 'react'

// For the about page different
export default function AboutPage() {
  const container: React.CSSProperties = { padding: '2rem', maxWidth: 1000, margin: '0 auto' }
  const title: React.CSSProperties = { fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--foreground)' }
  const card: React.CSSProperties = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,.1)'
  }
  const grid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: '1.25rem'
  }
  const section: React.CSSProperties = {
    background: 'var(--bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: '1rem'
  }
  const muted: React.CSSProperties = { color: 'var(--muted-color)' }

  return (
    <main style={container}>
      <h1 style={title}>ℹ️ About</h1>

      <div style={card}>
        <div style={grid}>
          {/* Left: Student details */}
          <section style={section}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem', color: 'var(--foreground)' }}>
              Student Details
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.75rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--nav-bg)',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700
                }}
              >
                QB
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Queen Bajracharya</div>
                <div style={muted}>Student # 21976171</div>
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6, ...muted }}>
              <p>
                The video shall demonstrate how to navigate the website, switch between pages, 
                and generate the HTML output. It also contains information about the codes as well.
              </p>
            </ul>
          </section>

          {/* How-to video space on the right */}
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem', color: 'var(--foreground)' }}>
              How to Use This Website
            </h2>

            {/* YouTube link adding */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                background: 'black'
              }}
            >
              <iframe
                title="How to use this website"
                src="https://www.youtube.com/embed/dGy4eSDM3Jc"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
