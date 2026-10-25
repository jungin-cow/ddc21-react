// API 서버(server/) 호출. 개발 중에는 vite.config.js 의 프록시가 /api 를 API 서버로 넘긴다.
// 다른 주소의 API 서버를 쓰려면 빌드할 때 VITE_API_BASE=http://서버:3001/api/v1 을 준다.
import { useCallback, useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export async function apiGet(path, params, signal) {
  const search = new URLSearchParams(Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null))
  const url = `${API_BASE}${path}${search.size ? `?${search}` : ''}`
  let res
  try {
    res = await fetch(url, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError(0, '서버에 연결할 수 없습니다.')
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, body?.message ?? `요청에 실패했습니다. (HTTP ${res.status})`)
  return body
}

// path 나 params 가 바뀌면 다시 불러온다. 이전 요청은 취소해서 늦게 온 응답이 화면을 덮지 않게 한다.
export function useApi(path, params) {
  const key = JSON.stringify([path, params])
  const [state, setState] = useState({ key: null, data: null, error: null })
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    const [p, q] = JSON.parse(key)
    apiGet(p, q, controller.signal).then(
      (data) => setState({ key, data, error: null }),
      (error) => error.name !== 'AbortError' && setState({ key, data: null, error }),
    )
    return () => controller.abort()
  }, [key, path, retry])

  const reload = useCallback(() => {
    setState((s) => ({ ...s, key: null }))
    setRetry((n) => n + 1)
  }, [])

  // 지금 요청한 것과 다른 응답(이전 페이지 등)은 보여주지 않는다.
  const current = state.key === key
  return { data: current ? state.data : null, error: current ? state.error : null, loading: !current, reload }
}

// '2026-10-04T17:34:15+09:00' → '2026년 10월 4일' (API가 이미 KST로 준다)
export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${y}년 ${m}월 ${d}일`
}
