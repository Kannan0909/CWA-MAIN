'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import type { NavigationItem } from '@/types'

interface ClientLayoutProps { children: ReactNode }

export function ClientLayout({ children }: ClientLayoutProps) {
  // Theme cookie init so first client render matches saved theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return Cookies.get('a1_theme') === 'dark'
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const studentName = 'Queen Bajracharya'
  const studentNumber = '21976171'

  // Main navigation items
  const leftItems: NavigationItem[] = [
    { id: 'tabs', label: 'Tabs', href: '/' },
    { id: 'prelab', label: 'Pre-lab Questions', href: '/pre-lab' },
    { id: 'escape-room', label: 'Escape Room', href: '/escape-room' },
    { id: 'coding-races', label: 'Coding Races', href: '/coding-races' },
    { id: 'court-room', label: 'Court Room', href: '/court-room' },
  ]

  // About on the right
  const aboutItem: NavigationItem = { id: 'about', label: 'About', href: '/about' }

  // last-visited cookie
  useEffect(() => {
    const all = [...leftItems, aboutItem]
    const current = all.find(i => i.href === pathname)
    if (current) Cookies.set('a1_last_visited', current.id, { expires: 7, path: '/' })
    setIsMenuOpen(false)

  }, [pathname])

  // Restore last visited
  useEffect(() => {
    const last = Cookies.get('a1_last_visited')
    if (!last) return
    const match = [...leftItems, aboutItem].find(i => i.id === last)
    if (match && pathname === '/') router.push(match.href)
    
  }, [])

  // Persisting dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      Cookies.set('a1_theme', 'dark', { expires: 365, path: '/' })
    } else {
      document.documentElement.removeAttribute('data-theme')
      Cookies.set('a1_theme', 'light', { expires: 365, path: '/' })
    }
  }, [isDarkMode])

  // Close hamburger on outside click or Escape
  useEffect(() => {
    if (!isMenuOpen) return
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current) return
      const target = e.target as Node
      if (!menuRef.current.contains(target) && !buttonRef.current?.contains(target)) {
        setIsMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [isMenuOpen])

  const go = (item: NavigationItem) => {
    Cookies.set('a1_last_visited', item.id, { expires: 7, path: '/' })
    setIsMenuOpen(false)
    router.push(item.href)
  }

  // styles
  const headerStyle: React.CSSProperties = {
    backgroundColor: 'var(--nav-bg)',
    color: 'var(--foreground)',
    padding: '1rem 2rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    margin: 0,
  }

  const navStyle: React.CSSProperties = {
    backgroundColor: 'var(--card-bg)',
    borderBottom: '1px solid var(--border-color)',
    padding: '0.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  }

  const leftGroupStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem' }
  const rightGroupStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }

  const navBtn: React.CSSProperties = {
    padding: '0.5rem 0.9rem',
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--foreground)',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'background-color .15s ease',
  }
  const activeBtn: React.CSSProperties = { ...navBtn, background: 'var(--button-bg)', color: '#fff' }

  const hamburgerButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 4,
    cursor: 'pointer',
    padding: '0.5rem',
    border: '1px solid var(--border-color)',
    background: 'var(--background)',
    borderRadius: 8,
  }
  const lineStyle: React.CSSProperties = {
    width: 20,
    height: 2,
    backgroundColor: 'var(--foreground)',
    borderRadius: 2,
    transition: 'transform .2s ease, opacity .2s ease',
  }
  const menuPanelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    boxShadow: '0 10px 28px rgba(0,0,0,.12)',
    marginTop: 10,
    minWidth: 240,
    zIndex: 1000,
    overflow: 'hidden',
  }
  const menuListStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  }
  const itemBtn: React.CSSProperties = {
    width: '100%',
    textAlign: 'left' as const,
    border: 'none',
    background: 'transparent',
    color: 'var(--foreground)',
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
  }
  const toggleRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    padding: '6px 2rem 8px',
    backgroundColor: 'var(--card-bg)',
    borderBottom: '1px solid var(--border-color)',
  }
  const mainStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 140px)',
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
  }
  const footerStyle: React.CSSProperties = {
    backgroundColor: 'var(--nav-bg)',
    color: 'var(--foreground)',
    padding: '1rem 2rem',
    borderTop: '1px solid var(--border-color)',
    textAlign: 'center',
    fontSize: '0.9rem',
  }

  return (
    <>
      {/* Header */}
      <header style={headerStyle}>
        <div>Student No: {studentNumber}</div>
        <h1 style={titleStyle}> CWA Assignment 1</h1>
        <div style={{ opacity: 0 }} aria-hidden>
          Student No: {studentNumber}
        </div>
      </header>

      {/* For Top navigation */}
      <nav style={navStyle}>
        {/* LEFT */}
        <div style={leftGroupStyle}>
          {leftItems.map(item => {
            const isActive = pathname === item.href
            return (
              <button
                key={item.id}
                onClick={() => go(item)}
                style={isActive ? activeBtn : navBtn}
                onMouseEnter={e => { if (!isActive) (e.currentTarget.style.backgroundColor = 'var(--nav-bg)') }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget.style.backgroundColor = 'transparent') }}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* About and Hamburger on the right side */}
        <div style={rightGroupStyle}>
          <button
            onClick={() => go(aboutItem)}
            style={pathname === aboutItem.href ? activeBtn : navBtn}
            onMouseEnter={e => { if (pathname !== aboutItem.href) (e.currentTarget.style.backgroundColor = 'var(--nav-bg)') }}
            onMouseLeave={e => { if (pathname !== aboutItem.href) (e.currentTarget.style.backgroundColor = 'transparent') }}
          >
            {aboutItem.label}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-label="Open navigation menu"
              style={hamburgerButtonStyle}
            >
              <span style={{ ...lineStyle, transform: isMenuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
              <span style={{ ...lineStyle, opacity: isMenuOpen ? 0 : 1 }} />
              <span style={{ ...lineStyle, transform: isMenuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
            </button>

            {isMenuOpen && (
              <div ref={menuRef} role="menu" aria-label="Nav menu" style={menuPanelStyle}>
                <ul style={menuListStyle}>
                  {leftItems.map(item => (
                    <li key={item.id} role="none">
                      <button
                        role="menuitem"
                        style={itemBtn}
                        onClick={() => go(item)}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--nav-bg)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Dark mode toggle */}
      <div style={toggleRowStyle}>
        <span style={{ fontSize: 14, color: 'var(--muted-color)' }}>Dark mode</span>
        <button
          onClick={() => setIsDarkMode(d => !d)}
          role="switch"
          aria-checked={isDarkMode}
          aria-label="Toggle dark mode"
          tabIndex={0}
          style={{
            width: 46, height: 24, backgroundColor: isDarkMode ? 'var(--success-bg)' : 'var(--border-color)',
            borderRadius: 24, position: 'relative', cursor: 'pointer', border: 'none'
          }}
        >
          <div
            style={{
              width: 20, height: 20, backgroundColor: '#fff', borderRadius: '50%',
              position: 'absolute', top: 2, left: isDarkMode ? 24 : 2, transition: 'left .25s'
            }}
          />
        </button>
      </div>

      {/* Main content */}
      <main style={mainStyle}>{children}</main>

      {/* Footer */}
      <footer role="contentinfo" style={footerStyle}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} {studentName} | Student No: {studentNumber} | 15/08/25
        </p>
      </footer>
    </>
  )
}
