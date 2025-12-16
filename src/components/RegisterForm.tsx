import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { register } from '@/utils/auth-api'

function RegisterForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    if (!phone) return true // Telefone é opcional
    // Aceita formatos: (11) 99999-9999, 11999999999, etc
    return /^[\d\s\(\)\-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validações
    if (!formData.name.trim()) {
      setError('Por favor, informe seu nome completo')
      return
    }

    if (!formData.email.trim()) {
      setError('Por favor, informe seu email')
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Por favor, insira um email válido')
      return
    }

    if (!formData.password) {
      setError('Por favor, informe uma senha')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Por favor, insira um telefone válido')
      return
    }

    if (!acceptedTerms) {
      setError('Você precisa aceitar os termos e condições para continuar')
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
      })

      if (result.success) {
        setSuccess(true)
        // Redireciona para login após 2 segundos
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(result.error || 'Erro ao criar conta. Tente novamente.')
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.')
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

      {success && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Conta criada com sucesso! Redirecionando para o login...
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" style={{ color: '#28314d' }}>
          Nome Completo *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading || success}
          className="border-primary/20 focus:border-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" style={{ color: '#28314d' }}>
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading || success}
          className="border-primary/20 focus:border-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: '#28314d' }}>
            Senha *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isLoading || success}
            className="border-primary/20 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" style={{ color: '#28314d' }}>
            Confirmar Senha *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            disabled={isLoading || success}
            className="border-primary/20 focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" style={{ color: '#28314d' }}>
            Telefone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isLoading || success}
            className="border-primary/20 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" style={{ color: '#28314d' }}>
            Empresa
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Nome da empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={isLoading || success}
            className="border-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          disabled={isLoading || success}
          className="mt-1"
        />
        <Label
          htmlFor="terms"
          className="text-sm leading-relaxed cursor-pointer"
          style={{ color: '#28314d' }}
        >
          Eu aceito os{' '}
          <a
            href="#"
            className="underline hover:no-underline"
            onClick={(e) => {
              e.preventDefault()
              // Aqui você pode abrir um modal ou navegar para página de termos
              alert('Termos e condições serão implementados em breve.')
            }}
          >
            termos e condições
          </a>{' '}
          e a{' '}
          <a
            href="#"
            className="underline hover:no-underline"
            onClick={(e) => {
              e.preventDefault()
              // Aqui você pode abrir um modal ou navegar para página de privacidade
              alert('Política de privacidade será implementada em breve.')
            }}
          >
            política de privacidade
          </a>
          *
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || success}
        style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" style={{ color: '#51ad78' }} />
            Criando conta...
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Conta criada!
          </>
        ) : (
          'Criar Conta'
        )}
      </Button>
    </form>
  )
}

export default RegisterForm

