import { useMemo, useSyncExternalStore } from 'react'

const subscribe = (callback: (e: Event) => void) => {
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
  }
}

const useDimensions = () => {
  const dimensions = useSyncExternalStore(subscribe, () =>
    JSON.stringify({
      width: window.innerWidth ?? 0,
      height: window.innerHeight ?? 0
    })
  )
  return useMemo(() => JSON.parse(dimensions), [dimensions])
}

export { useDimensions }
