// API de autenticação usando backend Express
import api from '@/config/api'

export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  company?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string | null
  company?: string | null
}

interface LoginResponse {
  user: User
  token: string
}

interface RegisterResponse {
  user: User
  token: string
}

// Login
export async function login(credentials: LoginCredentials): Promise<User | null> {
  try {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials)
    
    // Salvar token
    localStorage.setItem('token', response.token)
    localStorage.setItem('userId', response.user.id)
    
    return response.user
  } catch (error: any) {
    console.error('Erro ao fazer login:', error)
    throw new Error(error.message || 'Erro ao fazer login')
  }
}

// Registrar novo usuário
export async function register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await api.post<RegisterResponse>('/api/auth/register', data)
    
    // Salvar token
    localStorage.setItem('token', response.token)
    localStorage.setItem('userId', response.user.id)
    
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao registrar:', error)
    return { 
      success: false, 
      error: error.message || 'Erro ao criar conta. Tente novamente.' 
    }
  }
}

// Buscar usuário por ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await api.get<User>('/api/user/me')
    return user
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error)
    return null
  }
}

// Buscar usuário atual (usando token)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await api.get<User>('/api/user/me')
    return user
  } catch (error: any) {
    console.error('Erro ao buscar usuário atual:', error)
    // Se token inválido, limpar storage
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    }
    return null
  }
}

// Atualizar usuário
export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    const user = await api.put<User>('/api/user/me', data)
    return user
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    throw new Error(error.message || 'Erro ao atualizar usuário')
  }
}

// Alterar senha
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    await api.put('/api/user/me/password', {
      currentPassword,
      newPassword,
    })
    return true
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    throw new Error(error.message || 'Erro ao alterar senha')
  }
}

// Logout (limpar token)
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
}
