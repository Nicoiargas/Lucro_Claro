import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const success = await login(email, password)
      
      if (success) {
        // Redireciona para splash screen antes do dashboard
        navigate('/splash')
      } else {
        setError('Email ou senha incorretos')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" style={{ color: '#28314d' }}>Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="border-primary/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" style={{ color: '#28314d' }}>Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="border-primary/20 focus:border-primary"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" style={{ color: '#51ad78' }} />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  )
}

export default LoginForm

