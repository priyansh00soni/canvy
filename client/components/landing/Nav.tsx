import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <Link href="/" className={styles.brand}>
            <span className={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            Canvy
          </Link>
          <nav className={styles.links}>
            <a href="#product">Product</a>
            <a href="#how">How it works</a>
          </nav>
        </div>
        <Link href="/editor" className={styles.cta}>
          Start designing
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
