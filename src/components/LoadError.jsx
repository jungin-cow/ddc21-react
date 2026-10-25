import { FaRedo } from 'react-icons/fa'

// API 요청이 실패했을 때 보여주는 안내와 다시 시도 버튼
export default function LoadError({ error, onRetry }) {
  return (
    <div className="load-error" role="alert">
      <p>{error.status === 0 ? '서버에 연결할 수 없습니다. API 서버가 켜져 있는지 확인해 주세요.' : error.message}</p>
      {onRetry && (
        <button onClick={onRetry}>
          <FaRedo /> 다시 시도
        </button>
      )}
    </div>
  )
}
