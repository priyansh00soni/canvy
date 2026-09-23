import DemoCanvasStage from './DemoCanvasStage'
import styles from './ProductShowcase.module.css'
import type { CanvasElement } from '@/types/canvas'

const showcaseElements: CanvasElement[] = [
  {
    id: 'showcase-circle',
    type: 'circle',
    x: 100,
    y: 160,
    rotation: 0,
    fill: '#ADC4FF',
    radius: 56,
  },
  {
    id: 'showcase-rect',
    type: 'rect',
    x: 140,
    y: 130,
    rotation: -12,
    fill: '#F9B386',
    width: 312,
    height: 190,
  },
  {
    id: 'showcase-text',
    type: 'text',
    x: 240,
    y: 60,
    rotation: 0,
    fill: '#15161a',
    text: 'Make\nan idea.',
    fontSize: 48,
  },
]

export default function ProductShowcase() {
  return (
    <section className={styles.section} id="product">
      <div className={styles.inner}>
        <div className={styles.headingArea}>
          <p className={styles.eyebrow}>THE CANVY CANVAS</p>
          <h2 className={styles.heading}>
            <strong>Everything</strong> you need
            <br />
            to bring your <em className={styles.serifItalic}>ideas</em> to life.
          </h2>
        </div>

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

          {/* Body */}
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
                <span className={styles.toolDotsLabel}>...</span>
                <span>More</span>
              </div>
            </div>

            {/* Canvas */}
            <div className={styles.stageWrap}>
              <div className={styles.stageInner}>
                <DemoCanvasStage width={480} height={340} initialElements={showcaseElements} initialSelectedId="showcase-rect" />
                {/* Green triangle overlay */}
                <div className={styles.triangleOverlayGreen}>
                  <svg width="60" height="52" viewBox="0 0 60 52" fill="#789A7A">
                    <polygon points="30,0 60,52 0,52" />
                  </svg>
                </div>
                {/* Orange triangle */}
                <div className={styles.triangleOverlay}>
                  <svg width="50" height="44" viewBox="0 0 50 44" fill="#e9ad8e" opacity="0.85">
                    <polygon points="25,0 50,44 0,44" />
                  </svg>
                </div>
                {/* Dimension label */}
                <div className={styles.dimensionLabel}>312 × 190</div>
                {/* Cursor */}
                <div className={styles.cursorOverlay}>
                  <svg width="14" height="18" viewBox="0 0 16 20" fill="#15161a">
                    <path d="M1 1l5.5 17L9 11.5l7-2.5L1 1z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right inspector */}
            <div className={styles.inspector} aria-hidden="true">
              <div className={styles.inspectorTabs}>
                <span className={styles.inspectorTabActive}>Design</span>
                <span className={styles.inspectorTab}>Code</span>
                <span className={styles.inspectorTab}>Inspect</span>
              </div>

              <p className={styles.inspectorLabel}>Position</p>
              <div className={styles.inspectorRow}>
                <span><em>X</em> 140</span>
                <span><em>Y</em> 130</span>
              </div>

              <div className={styles.inspectorRow}>
                <span><em>W</em> 312</span>
                <span><em>H</em> 190</span>
              </div>

              <p className={styles.inspectorLabel}>Rotate</p>
              <div className={styles.inspectorValue}>-12°</div>

              <div className={styles.inspectorSpacer} />

              <p className={styles.inspectorLabel}>Fill</p>
              <div className={styles.swatchRow}>
                <span className={styles.swatch} style={{ background: '#e9ad8e' }} />
                <span>#FFC306</span>
              </div>

              <p className={styles.inspectorLabel}>Stroke</p>
              <div className={styles.strokeRow}>
                <span className={styles.strokeSize}>1px</span>
                <span className={styles.strokeSwatch} style={{ background: '#111827' }} />
                <span className={styles.strokeHex}>#111827</span>
              </div>

              <div className={styles.inspectorSpacer} />

              <p className={styles.inspectorLabel}>Text</p>
              <div className={styles.inspectorValue}>&nbsp;</div>

              <div className={styles.fontRow}>
                <span className={styles.fontName}>Inter</span>
                <span className={styles.fontSize}>48</span>
              </div>

              <div className={styles.formatRow}>
                <span><strong>B</strong></span>
                <span><em>I</em></span>
                <span style={{ textDecoration: 'underline' }}>U</span>
                <span className={styles.formatSep} />
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M3 12h12M3 18h18" />
                  </svg>
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M6 12h12M3 18h18" />
                  </svg>
                </span>
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M9 12h12M3 18h18" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Zoom bar */}
          <div className={styles.zoomBar}>
            <div className={styles.zoomControls}>
              <span className={styles.zoomBtn}>&minus;</span>
              <span className={styles.zoomVal}>100%</span>
              <span className={styles.zoomBtn}>+</span>
              <span className={styles.zoomBtn}>R</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
