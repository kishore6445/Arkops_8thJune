"use client"

import { useRef, useState } from "react"

export function useUnsavedChanges(hasChanges: boolean) {
  const [showWarning, setShowWarning] = useState(false)
  const [pendingClose, setPendingClose] = useState(false)
  const closeCallbackRef = useRef<(() => void) | null>(null)

  const handleClose = (callback: () => void) => {
    if (hasChanges) {
      setShowWarning(true)
      setPendingClose(true)
      closeCallbackRef.current = callback
      return false
    }
    callback()
    return true
  }

  const confirmClose = () => {
    setShowWarning(false)
    setPendingClose(false)
    if (closeCallbackRef.current) {
      closeCallbackRef.current()
      closeCallbackRef.current = null
    }
  }

  const cancelClose = () => {
    setShowWarning(false)
    setPendingClose(false)
    closeCallbackRef.current = null
  }

  return {
    showWarning,
    pendingClose,
    handleClose,
    confirmClose,
    cancelClose,
  }
}
