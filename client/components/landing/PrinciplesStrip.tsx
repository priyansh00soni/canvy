import styles from './PrinciplesStrip.module.css'

const principles = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
      </svg>
    ),
    title: 'No account',
    body: 'Jump in instantly. No sign-up, no hassle.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        <path d="M13 13l6 6" />
      </svg>
    ),
    title: 'Move, resize, rotate',
    body: 'Full control over your elements with an intuitive interface.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9" />
        <path d="M12 12v9" />
        <path d="M8 17l4-4 4 4" />
      </svg>
    ),
    title: 'Save when you\'re ready',
    body: 'Create a free account to save, load and manage your designs.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18" />
        <path d="M9 3v6" />
      </svg>
    ),
    title: 'Your canvas',
    body: 'Design freely, with a clean, minimal workspace.',
  },
]

export default function PrinciplesStrip() {
  return (
    <section className={styles.strip}>
      <div className={styles.grid}>
        {principles.map((principle) => (
          <div className={styles.item} key={principle.title}>
            <div className={styles.iconWrap}>{principle.icon}</div>
            <p className={styles.itemTitle}>{principle.title}</p>
            <p className={styles.itemBody}>{principle.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
