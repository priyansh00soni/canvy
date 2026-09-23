import Link from 'next/link'
import DemoCanvasStage from './DemoCanvasStage'
import styles from './Hero.module.css'
import type { CanvasElement } from '@/types/canvas'

const heroElements: CanvasElement[] = [
  {
    id: 'hero-circle',
    type: 'circle',
    x: 60,
    y: 80,
    rotation: 0,
    fill: '#b8e3c3',
    radius: 46,
  },
  {
    id: 'hero-rect',
    type: 'rect',
    x: 140,
    y: 110,
    rotation: 10,
    fill: '#8495F5',
    width: 140,
    height: 100,
  },
  {
    id: 'hero-text',
    type: 'text',
    x: 170,
    y: 40,
    rotation: 0,
    fill: '#15161a',
    text: 'Better\nideas',
    fontSize: 24,
  },
]

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>A SIMPLE CANVAS FOR IDEAS.</p>
        <h1 className={styles.headline}>
          A <em className={styles.serifItalic}>quieter</em> way
          <br />
          to design.
        </h1>
        <p className={styles.subhead}>
          Create beautiful visuals with simple shapes
          <br />
          and text. No account needed.
          <br />
          Just design, move, resize, rotate and save
          <br />
          when you&apos;re ready.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/editor" className={styles.primaryButton}>
            Start designing
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className={styles.canvasWrap}>
        <div className={styles.editorFrame}>
          {/* Top bar */}
          <div className={styles.topBar}>
            <div className={styles.topBarLeft}>
              <span className={styles.frameBrandIcon}>
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <span className={styles.frameBrandName}>Canvy</span>
              <span className={styles.frameName}>Untitled canvas</span>
              <span className={styles.frameDraft}>Draft</span>
            </div>
            <div className={styles.topBarRight}>
              <span className={styles.zoomLabel}>100%</span>
              <span className={styles.frameSave}>Save</span>
            </div>
          </div>

          {/* Body: toolbar + canvas + inspector */}
          <div className={styles.editorBody}>
            {/* Left toolbar with labels */}
            <div className={styles.toolColumn} aria-hidden="true">
              <div className={`${styles.toolItem} ${styles.toolItemActive}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="4" y="6" width="16" height="12" rx="2" />
                </svg>
              </div>
              <div className={styles.toolItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="8" />
                </svg>
                <span>Shape</span>
              </div>
              <div className={styles.toolItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M5 6h14M12 6v13" />
                </svg>
                <span>Text</span>
              </div>
              <div className={styles.toolItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>Image</span>
              </div>
              <div className={styles.toolItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 3v18" />
                </svg>
                <span>Frames</span>
              </div>
              <div className={styles.toolItem}>
                <span className={styles.toolDots}>...</span>
                <span>More</span>
              </div>
            </div>

            {/* Canvas area */}
            <div className={styles.stageWrap}>
              <div className={styles.stageInner}>
                <DemoCanvasStage width={320} height={260} initialElements={heroElements} initialSelectedId="hero-rect" />
                {/* Triangle overlay */}
                <div className={styles.triangleOverlay}>
                  <svg width="45" height="40" viewBox="0 0 55 48" fill="#e9ad8e">
                    <polygon points="27.5,0 55,48 0,48" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right inspector */}
            <div className={styles.inspector} aria-hidden="true">
              <div className={styles.inspectorTabs}>
                <span className={styles.inspectorTabActive}>Design</span>
                <span className={styles.inspectorTab}>Code</span>
              </div>

              <p className={styles.inspectorLabel}>Position</p>
              <div className={styles.inspectorRow}>
                <span><em>X</em> 220</span>
                <span><em>Y</em> 140</span>
              </div>

              <div className={styles.inspectorRow}>
                <span><em>W</em> 220</span>
                <span><em>H</em> 140</span>
              </div>

              <p className={styles.inspectorLabel}>Rotation</p>
              <div className={styles.inspectorValue}>16°</div>

              <div className={styles.inspectorSpacer} />

              <p className={styles.inspectorLabel}>Fill</p>
              <div className={styles.swatchRow}>
                <span className={styles.swatch} style={{ background: '#a7c957' }} />
                <span>#A7C957</span>
              </div>

              <div className={styles.inspectorSpacer} />

              <p className={styles.inspectorLabel}>Stroke</p>
              <div className={styles.strokeRow}>
                <span className={styles.strokeSize}>1px</span>
                <span className={styles.strokeSwatch} style={{ background: '#111827' }} />
                <span className={styles.strokeHex}>#111827</span>
              </div>
            </div>
          </div>

          {/* Bottom coordinate bar */}
          <div className={styles.coordBar}>
            <span><em>X</em> 220</span>
            <span><em>Y</em> 140</span>
          </div>
        </div>
      </div>
    </section>
  )
}
