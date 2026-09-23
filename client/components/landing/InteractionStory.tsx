import styles from './InteractionStory.module.css'

export default function InteractionStory() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Step 1: Create */}
          <div className={styles.step}>
            <p className={styles.stepNumber}>01</p>
            <h3 className={styles.stepTitle}>Create</h3>
            <p className={styles.stepBody}>
              Add shapes and text from the toolbar.
              New elements appear near the center
              of your canvas.
            </p>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                {/* Mini toolbar */}
                <div className={styles.miniToolbar}>
                  <div className={styles.miniToolActive}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                    </svg>
                  </div>
                  <div className={styles.miniToolIcon}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </div>
                  <div className={styles.miniToolIcon}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M5 6h14M12 6v13" />
                    </svg>
                  </div>
                  <div className={styles.miniToolDots}><span /><span /><span /></div>
                </div>
                {/* Canvas */}
                <div className={styles.miniCanvas}>
                  <div className={styles.addTooltip}>Add circle</div>
                  <div className={styles.miniCircle} style={{ background: '#ADC4FF' }} />
                  <div className={styles.miniCursor}>
                    <svg width="13" height="16" viewBox="0 0 16 20" fill="#15161a">
                      <path d="M1 1l5.5 17L9 11.5l7-2.5L1 1z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Shape */}
          <div className={styles.step}>
            <p className={styles.stepNumber}>02</p>
            <h3 className={styles.stepTitle}>Shape</h3>
            <p className={styles.stepBody}>
              Drag, resize and rotate your elements
              with ease. Precision guides help you
              keep things aligned.
            </p>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.shapeCanvas}>
                  <div className={styles.shapeRect}>
                    <div className={styles.handleTL} />
                    <div className={styles.handleTR} />
                    <div className={styles.handleBL} />
                    <div className={styles.handleBR} />
                  </div>
                  <div className={styles.shapeLabelRotation}>-12°</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Keep */}
          <div className={styles.step}>
            <p className={styles.stepNumber}>03</p>
            <h3 className={styles.stepTitle}>Keep</h3>
            <p className={styles.stepBody}>
              Save your work when you&apos;re ready.
              Create an account to access your
              canvases anytime.
            </p>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.keepHeader}>
                  <span className={styles.keepSaveBtn}>Save</span>
                  <span className={styles.keepSaved}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4c8c5b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Saved
                  </span>
                </div>
                <div className={styles.keepFields}>
                  <span className={styles.keepField}><em>W</em> 100%</span>
                  <span className={styles.keepField}><em>H</em> 100%</span>
                </div>
                <div className={styles.canvasList}>
                  <p className={styles.canvasListTitle}>My Canvases</p>
                  <div className={styles.canvasItem}>
                    <span className={styles.canvasThumb} style={{ background: '#ADC4FF' }} />
                    <div>
                      <p className={styles.canvasName}>Project 1</p>
                      <p className={styles.canvasDate}>3 hours ago</p>
                    </div>
                  </div>
                  <div className={styles.canvasItem}>
                    <span className={styles.canvasThumb} style={{ background: '#F9B386' }} />
                    <div>
                      <p className={styles.canvasName}>Brand Ideas</p>
                      <p className={styles.canvasDate}>Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
