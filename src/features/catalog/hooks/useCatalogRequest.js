import { useEffect, useRef, useState } from 'react'

export function useCatalogRequest(factory, deps = [], initialData = null) {
  const [state, setState] = useState({ data: initialData, loading: true, error: null })
  const [reloadCount, setReloadCount] = useState(0)
  const factoryRef = useRef(factory)
  const initialDataRef = useRef(initialData)
  const requestIdRef = useRef(0)
  const dependencyKey = JSON.stringify(deps)

  factoryRef.current = factory
  initialDataRef.current = initialData

  useEffect(() => {
    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setState((current) => ({ ...current, loading: true, error: null }))

    Promise.resolve(factoryRef.current(controller.signal))
      .then((data) => {
        if (requestIdRef.current !== requestId) return
        setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (controller.signal.aborted || error.name === 'AbortError') return
        if (requestIdRef.current !== requestId) return
        setState({ data: initialDataRef.current, loading: false, error })
      })

    return () => controller.abort()
  }, [dependencyKey, reloadCount])

  return {
    ...state,
    retry: () => setReloadCount((value) => value + 1),
  }
}
