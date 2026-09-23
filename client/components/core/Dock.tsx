'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'
import styles from './Dock.module.css'

export interface DockProps {
  className?: string
  children: React.ReactNode
}

export function Dock({ className, children }: DockProps) {
  const mouseY = useMotionValue(Infinity)

  return (
    <div
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={`${styles.dock}${className ? ` \${className}` : ''}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Only pass mouseY to custom React components (like DockItem), not native DOM elements like <div>
          if (typeof child.type === 'function') {
            return React.cloneElement(child as React.ReactElement<any>, {
              mouseY,
            })
          }
        }
        return child
      })}
    </div>
  )
}

export interface DockItemProps {
  className?: string
  children: React.ReactNode
  mouseY?: MotionValue<number> // Passed implicitly by Dock
  isActive?: boolean
  onClick?: () => void
  'aria-label'?: string
  title?: string
}

export function DockItem({ className, children, mouseY, isActive, onClick, ...props }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null)

  // Use a default MotionValue just in case it's rendered outside of <Dock>
  const defaultMouseY = useMotionValue(Infinity)
  const safeMouseY = mouseY || defaultMouseY

  const distanceCalc = useTransform(safeMouseY, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 40 }
    // Use a fixed base size (20 = 40/2) for the center calculation to prevent feedback loop vibration
    return val - bounds.y - 20
  })

  // Reduced magnification to make it more professional and less prone to layout shifts
  const widthSync = useTransform(distanceCalc, [-100, 0, 100], [40, 60, 40])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 })

  // Construct the class string cleanly without external dependencies
  const computedClassName = [
    styles.dockItem,
    isActive ? styles.dockItemActive : '',
    className || ''
  ].filter(Boolean).join(' ')

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      className={computedClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function DockLabel({ children }: { children: React.ReactNode }) {
  return <div className={styles.dockLabel}>{children}</div>
}

export function DockIcon({ children }: { children: React.ReactNode }) {
  return <div className={styles.dockIcon}>{children}</div>
}
