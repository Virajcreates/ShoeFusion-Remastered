"use client"

import { useEffect, useRef } from "react"

type EventName = keyof WindowEventMap

/**
 * Custom hook for safely adding event listeners that works with SSR
 */
export function useEventListener<K extends EventName>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: HTMLElement | Window | null,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores the handler
  const savedHandler = useRef(handler)

  // Update ref.current value if handler changes
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement = element ?? (typeof window !== "undefined" ? window : null)

    if (!targetElement || !targetElement.addEventListener) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event)

    targetElement.addEventListener(eventName, listener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options])
}
