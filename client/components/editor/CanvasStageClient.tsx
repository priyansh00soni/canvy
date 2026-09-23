'use client'

import dynamic from 'next/dynamic'

// react-konva touches the DOM/canvas API during module init, so it cannot
// run during server-side rendering. This wrapper is the only place that
// imports it, keeping the ssr:false boundary in one predictable spot.
const CanvasStage = dynamic(() => import('./CanvasStage'), {
  ssr: false,
  loading: () => null,
})

export default CanvasStage
