'use client'

import type { CanvasElement } from '@/types/canvas'
import styles from './PropertiesPanel.module.css'

import type { ToolMode } from './Editor'

type PropertiesPanelProps = {
  tool?: ToolMode
  selectedElement: CanvasElement | null
  onChange: (changes: Partial<CanvasElement>) => void
  penSettings?: { strokeWidth: number; strokeColor: string }
  onPenSettingsChange?: (settings: { strokeWidth: number; strokeColor: string }) => void
}

const elementTypeLabel: Record<CanvasElement['type'], string> = {
  rect: 'Rectangle',
  circle: 'Circle',
  text: 'Text',
  ellipse: 'Ellipse',
  triangle: 'Triangle',
  star: 'Star',
  pen: 'Pen',
}

const PRESET_COLORS = [
  '#1a1a1a', '#8b949e', '#e384f0', '#a441df',
  '#4056e8', '#4098e8', '#e8ab40', '#e86a40',
  '#1f9e61', '#51b851', '#f06969'
]

type Preset = 'S' | 'M' | 'L' | 'XL'
const TEXT_PRESETS: Record<Preset, number> = { S: 16, M: 24, L: 48, XL: 64 }
const PEN_PRESETS: Record<Preset, number> = { S: 2, M: 4, L: 8, XL: 16 }

export default function PropertiesPanel({ tool, selectedElement, onChange, penSettings, onPenSettingsChange }: PropertiesPanelProps) {
  const handleNumberChange = (field: keyof CanvasElement) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (Number.isNaN(value)) return
    onChange({ [field]: value })
  }

  const renderColorGrid = (value: string, field: 'fill' | 'stroke' | 'globalStroke') => (
    <div className={styles.colorGrid}>
      {PRESET_COLORS.map(color => (
        <div
          key={color}
          className={`${styles.colorSwatchWrapper} ${value.toLowerCase() === color.toLowerCase() ? styles.active : ''}`}
          onClick={() => {
            if (field === 'globalStroke' && penSettings && onPenSettingsChange) {
              onPenSettingsChange({ ...penSettings, strokeColor: color })
            } else {
              onChange({ [field]: color })
            }
          }}
        >
          <div className={styles.colorSwatchInner} style={{ backgroundColor: color }} />
        </div>
      ))}
      <div className={styles.colorSwatchWrapper}>
        <input
          type="color"
          className={styles.colorPickerInput}
          value={value}
          onChange={(e) => {
            if (field === 'globalStroke' && penSettings && onPenSettingsChange) {
              onPenSettingsChange({ ...penSettings, strokeColor: e.target.value })
            } else {
              onChange({ [field]: e.target.value })
            }
          }}
          aria-label={`Custom ${field} color`}
        />
      </div>
    </div>
  )

  const renderSizeControls = (
    value: number, 
    field: keyof CanvasElement | 'globalStrokeWidth', 
    presets: Record<Preset, number>, 
    min: number, 
    max: number
  ) => (
    <>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            if (field === 'globalStrokeWidth' && penSettings && onPenSettingsChange) {
              onPenSettingsChange({ ...penSettings, strokeWidth: Number(e.target.value) })
            } else {
              onChange({ [field as keyof CanvasElement]: Number(e.target.value) })
            }
          }}
        />
      </div>
      <div className={styles.sizePresets}>
        {(Object.keys(presets) as Preset[]).map(size => (
          <button
            key={size}
            className={`${styles.presetBtn} ${value === presets[size] ? styles.active : ''}`}
            onClick={() => {
              if (field === 'globalStrokeWidth' && penSettings && onPenSettingsChange) {
                onPenSettingsChange({ ...penSettings, strokeWidth: presets[size] })
              } else {
                onChange({ [field as keyof CanvasElement]: presets[size] })
              }
            }}
          >
            {size}
          </button>
        ))}
      </div>
      <label className={styles.field} style={{ marginBottom: 14 }}>
        <span>Custom px</span>
        <input
          type="number"
          value={Math.round(value)}
          onChange={(event) => {
            const v = Number(event.target.value)
            if (Number.isNaN(v)) return
            if (field === 'globalStrokeWidth' && penSettings && onPenSettingsChange) {
              onPenSettingsChange({ ...penSettings, strokeWidth: v })
            } else {
              onChange({ [field as keyof CanvasElement]: v })
            }
          }}
          aria-label={`Custom ${field}`}
        />
      </label>
    </>
  )

  if (tool === 'pen' && penSettings) {
    return (
      <div className={styles.panel}>
        <p className={styles.elementType}>Pen Settings</p>
        <p className={styles.label}>Stroke Color</p>
        {renderColorGrid(penSettings.strokeColor, 'globalStroke')}
        <p className={styles.label}>Stroke Width</p>
        {renderSizeControls(penSettings.strokeWidth, 'globalStrokeWidth', PEN_PRESETS, 1, 40)}
      </div>
    )
  }

  if (!selectedElement) {
    return (
      <div className={styles.panel}>
        <p className={styles.emptyState}>Select an element to see its properties.</p>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <p className={styles.elementType}>{elementTypeLabel[selectedElement.type]}</p>

      <p className={styles.label}>Position</p>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>X</span>
          <input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={handleNumberChange('x')}
            aria-label="X position"
          />
        </label>
        <label className={styles.field}>
          <span>Y</span>
          <input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={handleNumberChange('y')}
            aria-label="Y position"
          />
        </label>
      </div>

      {['rect', 'text'].includes(selectedElement.type) && (
        <>
          <p className={styles.label}>Size</p>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>W</span>
              <input
                type="number"
                value={Math.round(selectedElement.width || 0)}
                onChange={handleNumberChange('width')}
                aria-label="Width"
              />
            </label>
            <label className={styles.field}>
              <span>H</span>
              <input
                type="number"
                value={Math.round(selectedElement.height || 0)}
                onChange={handleNumberChange('height')}
                aria-label="Height"
              />
            </label>
          </div>
        </>
      )}

      {['circle', 'triangle'].includes(selectedElement.type) && (
        <>
          <p className={styles.label}>Radius</p>
          <label className={styles.field} style={{ marginBottom: 14 }}>
            <span>R</span>
            <input
              type="number"
              value={Math.round(selectedElement.radius || 0)}
              onChange={handleNumberChange('radius')}
              aria-label="Radius"
            />
          </label>
        </>
      )}

      {selectedElement.type === 'ellipse' && (
        <>
          <p className={styles.label}>Radius X/Y</p>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>RX</span>
              <input
                type="number"
                value={Math.round(selectedElement.radiusX || 0)}
                onChange={handleNumberChange('radiusX')}
                aria-label="Radius X"
              />
            </label>
            <label className={styles.field}>
              <span>RY</span>
              <input
                type="number"
                value={Math.round(selectedElement.radiusY || 0)}
                onChange={handleNumberChange('radiusY')}
                aria-label="Radius Y"
              />
            </label>
          </div>
        </>
      )}

      {selectedElement.type === 'star' && (
        <>
          <p className={styles.label}>Star Options</p>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>IN</span>
              <input
                type="number"
                value={Math.round(selectedElement.innerRadius || 0)}
                onChange={handleNumberChange('innerRadius')}
                aria-label="Inner Radius"
              />
            </label>
            <label className={styles.field}>
              <span>OUT</span>
              <input
                type="number"
                value={Math.round(selectedElement.outerRadius || 0)}
                onChange={handleNumberChange('outerRadius')}
                aria-label="Outer Radius"
              />
            </label>
          </div>
          <div className={styles.row} style={{ marginTop: 8 }}>
            <label className={styles.field}>
              <span>PTS</span>
              <input
                type="number"
                value={Math.round(selectedElement.numPoints || 5)}
                onChange={handleNumberChange('numPoints')}
                aria-label="Number of Points"
              />
            </label>
          </div>
        </>
      )}

      <p className={styles.label}>Rotation</p>
      <label className={styles.field} style={{ marginBottom: 14 }}>
        <span>°</span>
        <input
          type="number"
          value={Math.round(selectedElement.rotation)}
          onChange={handleNumberChange('rotation')}
          aria-label="Rotation in degrees"
        />
      </label>

      {selectedElement.type === 'text' && (
        <>
          <p className={styles.label}>Text</p>
          <input
            type="text"
            className={styles.textInput}
            value={selectedElement.text || ''}
            onChange={(event) => onChange({ text: event.target.value })}
            aria-label="Text content"
          />
          <p className={styles.label}>Font Size</p>
          {renderSizeControls(selectedElement.fontSize || 24, 'fontSize', TEXT_PRESETS, 8, 120)}
        </>
      )}

      {selectedElement.type !== 'pen' && (
        <>
          <p className={styles.label}>Fill Color</p>
          {renderColorGrid(selectedElement.fill, 'fill')}
        </>
      )}

      {selectedElement.type === 'pen' && (
        <>
          <p className={styles.label}>Stroke Color</p>
          {renderColorGrid(selectedElement.stroke || selectedElement.fill, 'stroke')}
          
          <p className={styles.label}>Stroke Width</p>
          {renderSizeControls(selectedElement.strokeWidth || 4, 'strokeWidth', PEN_PRESETS, 1, 40)}
        </>
      )}
    </div>
  )
}
