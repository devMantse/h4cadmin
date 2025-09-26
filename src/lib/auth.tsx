import { api, handleError } from './api'
import { createContext, useContext, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'

type User = { id: string; email: string; name: string } | null
type AuthCtx = {
  user: User
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: false
})

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User>(null)
  const [token, setToken] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t) setToken(t)
    if (u) setUser(JSON.parse(u))
  }, [])

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.access_token)
      setUser(data.user)
      toast.success('Welcome back!')
    },
    onError: (error) => {
      toast.error(handleError(error))
      throw error
    },
  })

  async function login(email: string, password: string) {
    await loginMutation.mutateAsync({ email, password })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    // Clear all cached queries
    queryClient.clear()
    toast.success('Logged out successfully')
  }

  return (
    <Ctx.Provider value={{
      user,
      token,
      login,
      logout,
      isLoading: loginMutation.isPending
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
