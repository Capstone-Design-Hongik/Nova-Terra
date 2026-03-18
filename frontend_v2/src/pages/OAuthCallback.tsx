import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { setTokens } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken)
      navigate('/marketplace', { replace: true })
    } else {
      console.error('토큰이 없습니다:', window.location.search)
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-lg">로그인 중...</p>
    </div>
  )
}
