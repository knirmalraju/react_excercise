import { useState, useEffect } from 'react'

function useToast(duration = 2500) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), duration)
    return () => clearTimeout(id)
  }, [toast, duration])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
  }

  return { toast, showToast }
}

export default useToast
