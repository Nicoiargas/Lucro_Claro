import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginService, getCurrentUser, logout as logoutService, type User } from '@/utils/auth-api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Verificar se há token salvo e buscar usuário atual
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await getCurrentUser()
          if (userData) {
            setUser(userData)
          } else {
            // Token inválido, limpar
            logoutService()
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const userData = await loginService({ email, password })
      
      if (userData) {
        setUser(userData)
        // Token já foi salvo pela função login
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    logoutService()
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

