import type { PlaceholderPageProps } from '@/types'

// For the content page of coding race, pre-lab, court room, and escape room
export function PlaceholderPage({ title, icon }: PlaceholderPageProps) {
    const containerStyle: React.CSSProperties = { padding: '2rem', maxWidth: 800, margin: '0 auto' }
    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8,
        padding: '3rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,.1)'
    }

    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--foreground)' }}>{title}</h1>
            <div style={cardStyle}>
                <span style={{ fontSize: '4rem', marginBottom: '2rem', display: 'block' }}>{icon}</span>
                <h2 style={{ color: 'var(--muted-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>Coming Soon</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--muted-color)', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.6 }}>
                    This {title.toLowerCase()} page is currently under development. Check back later!
                </p>

            </div>
        </div>
    )
}
