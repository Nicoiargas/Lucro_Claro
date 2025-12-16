import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Breadcrumbs from '@/components/Breadcrumbs'
import UserMenu from '@/components/UserMenu'
import { useAuth } from '@/contexts/AuthContext'
import { updateUser, changePassword, getCurrentUser } from '@/utils/auth-api'
import { Save, ArrowLeft, User, Mail, Phone, Lock, Bell, Globe, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function Account() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
  })

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [preferences, setPreferences] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: 'light',
  })

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setPersonalData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        role: user.role || 'user',
      })
    }
  }, [user])

  const handleSavePersonal = async () => {
    if (!user) return

    setMessage(null)
    
    try {
      const updated = await updateUser(user.id, {
        name: personalData.name,
        email: personalData.email,
        phone: personalData.phone || null,
        company: personalData.company || null,
        role: personalData.role,
      })

      if (updated) {
        setMessage({ type: 'success', text: 'Dados pessoais salvos com sucesso!' })
        // Recarregar dados do usuário
        const freshUser = await getCurrentUser()
        if (freshUser) {
          setPersonalData({
            name: freshUser.name || '',
            email: freshUser.email || '',
            phone: freshUser.phone || '',
            company: freshUser.company || '',
            role: freshUser.role || 'user',
          })
        }
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar dados. Tente novamente.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar dados. Tente novamente.' })
    }
  }

  const handleChangePassword = async () => {
    if (!user) return

    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' })
      return
    }

    try {
      const success = await changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      )

      if (success) {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao alterar senha. Tente novamente.' })
    }
  }

  const handleSavePreferences = () => {
    // Salvar preferências no localStorage por enquanto
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    setMessage({ type: 'success', text: 'Preferências salvas com sucesso!' })
  }

  // Carregar preferências do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch (error) {
        console.error('Erro ao carregar preferências:', error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-muted/50 py-4 sm:py-6 pb-6 sm:pb-8">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-5 lg:px-6">
        {/* Header com Logo e Menu do Usuário */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
            <img 
              src="/logo2.svg" 
              alt="Lucro Claro" 
              className="h-10 sm:h-[42px] w-auto"
            />
          </div>
          <div className="flex-1 flex justify-end">
            <UserMenu />
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#28314d' }}>
            Minha Conta
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Mensagens de feedback */}
        {message && (
          <Alert
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className="mb-6"
          >
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="personal" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#28314d] data-[state=active]:bg-transparent"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dados Pessoais
                </TabsTrigger>
                <TabsTrigger 
                  value="security"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#28314d] data-[state=active]:bg-transparent"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#28314d] data-[state=active]:bg-transparent"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Preferências
                </TabsTrigger>
              </TabsList>

              {/* Dados Pessoais */}
              <TabsContent value="personal" className="p-6 space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" style={{ color: '#28314d' }}>
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        value={personalData.name}
                        onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" style={{ color: '#28314d' }}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalData.email}
                        onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" style={{ color: '#28314d' }}>
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        value={personalData.phone}
                        onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" style={{ color: '#28314d' }}>
                        Empresa
                      </Label>
                      <Input
                        id="company"
                        value={personalData.company}
                        onChange={(e) => setPersonalData({ ...personalData, company: e.target.value })}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="role" style={{ color: '#28314d' }}>
                        Cargo
                      </Label>
                      <Input
                        id="role"
                        value={personalData.role}
                        onChange={(e) => setPersonalData({ ...personalData, role: e.target.value })}
                        className="border-primary/20 focus:border-primary"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        O cargo não pode ser alterado
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleSavePersonal}
                      className="gap-2"
                      style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
                    >
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Segurança */}
              <TabsContent value="security" className="p-6 space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" style={{ color: '#28314d' }}>
                      Senha Atual
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="border-primary/20 focus:border-primary"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" style={{ color: '#28314d' }}>
                      Nova Senha
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="border-primary/20 focus:border-primary"
                      placeholder="Digite sua nova senha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" style={{ color: '#28314d' }}>
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="border-primary/20 focus:border-primary"
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleChangePassword}
                      className="gap-2"
                      style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
                    >
                      <Lock className="h-4 w-4" />
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Preferências */}
              <TabsContent value="preferences" className="p-6 space-y-6 mt-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: '#28314d' }}>
                      Idioma e Região
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language" style={{ color: '#28314d' }}>
                          Idioma
                        </Label>
                        <select
                          id="language"
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-primary/20 focus:border-primary"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" style={{ color: '#28314d' }}>
                          Fuso Horário
                        </Label>
                        <select
                          id="timezone"
                          value={preferences.timezone}
                          onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-primary/20 focus:border-primary"
                        >
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/Manaus">Manaus (GMT-4)</option>
                          <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold" style={{ color: '#28314d' }}>
                      Notificações
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notif-email" style={{ color: '#28314d' }}>
                            Notificações por Email
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receba atualizações importantes por email
                          </p>
                        </div>
                        <Checkbox
                          id="notif-email"
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, email: checked === true }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notif-push" style={{ color: '#28314d' }}>
                            Notificações Push
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receba notificações no navegador
                          </p>
                        </div>
                        <Checkbox
                          id="notif-push"
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, push: checked === true }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notif-sms" style={{ color: '#28314d' }}>
                            Notificações por SMS
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receba alertas importantes por SMS
                          </p>
                        </div>
                        <Checkbox
                          id="notif-sms"
                          checked={preferences.notifications.sms}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, sms: checked === true }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleSavePreferences}
                      className="gap-2"
                      style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
                    >
                      <Save className="h-4 w-4" />
                      Salvar Preferências
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Account

