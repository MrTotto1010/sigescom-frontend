import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id_usuario: number
  nombre: string
  roles: string[]
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  loginUser: (user: User) => void
  logoutUser: () => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const loginUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logoutUser = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const hasRole = (role: string) => {
    return user?.roles.includes(role) || false
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, loginUser, logoutUser, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}