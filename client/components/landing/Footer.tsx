import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Main content */}
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <p className={styles.eyebrow}>YOUR IDEAS, BEAUTIFULLY MADE.</p>
          <h2 className={styles.headline}>Start with an idea.</h2>
          <div className={styles.ctaGroup}>
            <Link href="/editor" className={styles.cta}>
              Start designing
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a href="https://github.com/priyansh00soni/canvy" target="_blank" rel="noopener noreferrer" className={styles.githubBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Star us on GitHub
            </a>
          </div>
        </div>

        <div className={styles.topRight}>
          <img
            src="/footer-canvy.png"
            alt="CANVY"
            className={styles.footerImage}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomBrand}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span>Canvy</span>
        </div>
        <nav className={styles.nav}>
          <a href="#product">Product</a>
        </nav>
        <div className={styles.themeIcon} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
      </div>
    </footer>
  )
}
