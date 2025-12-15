import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { CPFInput } from '@/components/ui/cpf-input'
import { RGInput } from '@/components/ui/rg-input'
import { CEPInput } from '@/components/ui/cep-input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PercentageInput } from '@/components/ui/percentage-input'
import { DateInput } from '@/components/ui/date-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Save } from 'lucide-react'
import { getCollaborators, saveCollaborator, updateCollaborator, deleteCollaborator, canDeleteCollaborator, type Collaborator } from '@/utils/storage'
import { validateCPF, validateEmail } from '@/utils/validation'
import { getAllProjectsByCollaborator } from '@/utils/project-storage'

function CollaboratorForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'available' as 'busy' | 'available',
    
    // Informações de Projeto
    hourlyRate: '',
    monthlySalary: '',
    totalCost: '',
    allocationRate: '',
    
    // Informações de Contrato
    admissionDate: '',
    terminationDate: '',
    contractType: '' as '' | 'CLT' | 'PJ' | 'Estágio' | 'Freelancer' | 'Outro',
    probationPeriod: '',
    
    // Dados Financeiros
    cpf: '',
    rg: '',
    bank: '',
    agency: '',
    account: '',
    pisPasep: '',
    
    // Endereço
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Informações de Saúde
    allergies: '',
    bloodType: '' as '' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Não informado',
    healthInsurance: '',
    healthInsuranceNumber: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  const [activeProjects, setActiveProjects] = useState<string[]>([])
  const [canDelete, setCanDelete] = useState(true)

  useEffect(() => {
    if (isEdit && id) {
      const collaborators = getCollaborators()
      const collaborator = collaborators.find(c => c.id === id)
      if (collaborator) {
        setFormData({
          name: collaborator.name || '',
          email: collaborator.email || '',
          phone: collaborator.phone || '',
          role: collaborator.role || '',
          status: collaborator.status || 'available',
          hourlyRate: collaborator.hourlyRate || '',
          monthlySalary: collaborator.monthlySalary || '',
          totalCost: collaborator.totalCost || '',
          allocationRate: collaborator.allocationRate || '',
          admissionDate: collaborator.admissionDate || '',
          terminationDate: collaborator.terminationDate || '',
          contractType: collaborator.contractType || '',
          probationPeriod: collaborator.probationPeriod?.toString() || '',
          cpf: collaborator.cpf || '',
          rg: collaborator.rg || '',
          bank: collaborator.bank || '',
          agency: collaborator.agency || '',
          account: collaborator.account || '',
          pisPasep: collaborator.pisPasep || '',
          cep: collaborator.cep || '',
          street: collaborator.street || '',
          number: collaborator.number || '',
          complement: collaborator.complement || '',
          neighborhood: collaborator.neighborhood || '',
          city: collaborator.city || '',
          state: collaborator.state || '',
          allergies: collaborator.allergies || '',
          bloodType: collaborator.bloodType || '',
          healthInsurance: collaborator.healthInsurance || '',
          healthInsuranceNumber: collaborator.healthInsuranceNumber || '',
        })
      }
    }
  }, [isEdit, id])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Remove erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddressFound = (address: { street: string; neighborhood: string; city: string; state: string }) => {
    setFormData(prev => ({
      ...prev,
      street: address.street,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validação de campos obrigatórios
    if (!formData.name) newErrors.name = 'Nome completo é obrigatório'
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.role) newErrors.role = 'Cargo/Função é obrigatório'
    
    // Informações de Projeto
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Salário/hora é obrigatório'
    if (!formData.monthlySalary) newErrors.monthlySalary = 'Salário mensal é obrigatório'
    if (!formData.totalCost) newErrors.totalCost = 'Custo total é obrigatório'
    if (!formData.allocationRate) newErrors.allocationRate = 'Taxa de alocação é obrigatória'
    
    // Informações de Contrato
    if (!formData.admissionDate) newErrors.admissionDate = 'Data de admissão é obrigatória'
    if (!formData.contractType) newErrors.contractType = 'Tipo de contrato é obrigatório'
    
    // Validação de data de término
    if (formData.terminationDate && formData.admissionDate) {
      const admission = new Date(formData.admissionDate)
      const termination = new Date(formData.terminationDate)
      if (termination < admission) {
        newErrors.terminationDate = 'Data de término não pode ser anterior à data de admissão'
      }
    }
    
    // Dados Financeiros
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório'
    } else {
      const cleanCPF = formData.cpf.replace(/\D/g, '')
      if (cleanCPF.length === 11 && !validateCPF(formData.cpf)) {
        newErrors.cpf = 'CPF inválido'
      }
    }
    if (!formData.rg) newErrors.rg = 'RG é obrigatório'
    
    // Endereço
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório'
    if (!formData.street) newErrors.street = 'Rua/Logradouro é obrigatório'
    if (!formData.number) newErrors.number = 'Número é obrigatório'
    if (!formData.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório'
    if (!formData.city) newErrors.city = 'Cidade é obrigatória'
    if (!formData.state) newErrors.state = 'Estado é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      alert('Por favor, corrija os erros no formulário')
      return
    }

    const collaboratorData: Omit<Collaborator, 'id'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      hourlyRate: formData.hourlyRate,
      monthlySalary: formData.monthlySalary,
      totalCost: formData.totalCost,
      allocationRate: formData.allocationRate,
      admissionDate: formData.admissionDate,
      terminationDate: formData.terminationDate || undefined,
      contractType: formData.contractType || undefined,
      probationPeriod: formData.probationPeriod ? parseInt(formData.probationPeriod) : undefined,
      cpf: formData.cpf,
      rg: formData.rg,
      bank: formData.bank || undefined,
      agency: formData.agency || undefined,
      account: formData.account || undefined,
      pisPasep: formData.pisPasep || undefined,
      cep: formData.cep,
      street: formData.street,
      number: formData.number,
      complement: formData.complement || undefined,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      allergies: formData.allergies || undefined,
      bloodType: formData.bloodType || undefined,
      healthInsurance: formData.healthInsurance || undefined,
      healthInsuranceNumber: formData.healthInsuranceNumber || undefined,
    }

    if (isEdit && id) {
      const updated = updateCollaborator(id, collaboratorData)
      if (updated) {
        alert('Colaborador atualizado com sucesso!')
        navigate('/dashboard')
      } else {
        alert('Erro ao atualizar colaborador')
      }
    } else {
      saveCollaborator(collaboratorData)
      alert('Colaborador cadastrado com sucesso!')
      navigate('/dashboard')
    }
  }

  const handleDeleteClick = () => {
    if (!isEdit || !id) return
    
    // Verifica se pode deletar
    const { canDelete: canDel, activeProjects: projects } = canDeleteCollaborator(id)
    setCanDelete(canDel)
    setActiveProjects(projects)
    setShowDeleteDialog(true)
    setDeleteConfirmed(false)
  }

  const handleDeleteConfirm = () => {
    if (!isEdit || !id) return

    // Se não pode deletar, não permite
    if (!canDelete) {
      return
    }

    if (!deleteConfirmed) {
      setDeleteConfirmed(true)
      return
    }

    const deleted = deleteCollaborator(id)
    if (deleted) {
      alert('Colaborador deletado com sucesso!')
      navigate('/dashboard')
    } else {
      alert('Erro ao deletar colaborador')
    }
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/logo2.svg" 
            alt="Lucro Claro" 
            style={{ height: '50px', width: 'auto' }}
          />
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto mb-6">
          <Breadcrumbs />
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl" style={{ color: '#28314d' }}>
              {isEdit ? 'Editar Colaborador' : 'Cadastro de Colaborador'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className={`grid w-full ${isEdit ? 'grid-cols-7' : 'grid-cols-6'}`}>
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="project">Projeto</TabsTrigger>
                <TabsTrigger value="contract">Contrato</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="health">Saúde</TabsTrigger>
                {isEdit && <TabsTrigger value="history">Histórico</TabsTrigger>}
              </TabsList>

              {/* Aba 1: Dados Pessoais */}
              <TabsContent value="personal" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" style={{ color: '#28314d' }}>
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Digite o nome completo"
                      className={`border-primary/20 focus:border-primary ${errors.name ? 'border-destructive' : ''}`}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" style={{ color: '#28314d' }}>
                      Cargo/Função *
                    </Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="Ex: Desenvolvedor Full Stack"
                      className={`border-primary/20 focus:border-primary ${errors.role ? 'border-destructive' : ''}`}
                    />
                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" style={{ color: '#28314d' }}>
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="colaborador@email.com"
                      className={`border-primary/20 focus:border-primary ${errors.email ? 'border-destructive' : ''}`}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" style={{ color: '#28314d' }}>
                      Telefone *
                    </Label>
                    <PhoneInput
                      id="phone"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      className={`border-primary/20 focus:border-primary ${errors.phone ? 'border-destructive' : ''}`}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" style={{ color: '#28314d' }}>
                      Status Inicial
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'busy' | 'available') => {
                        handleInputChange('status', value)
                      }}
                    >
                      <SelectTrigger className="border-primary/20 focus:border-primary">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="busy">Ocupado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Aba 2: Informações de Projeto */}
              <TabsContent value="project" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" style={{ color: '#28314d' }}>
                      Salário/Hora *
                    </Label>
                    <CurrencyInput
                      id="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={(value) => handleInputChange('hourlyRate', value)}
                      className={`border-primary/20 focus:border-primary ${errors.hourlyRate ? 'border-destructive' : ''}`}
                    />
                    {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlySalary" style={{ color: '#28314d' }}>
                      Salário Mensal Fixo *
                    </Label>
                    <CurrencyInput
                      id="monthlySalary"
                      value={formData.monthlySalary}
                      onChange={(value) => handleInputChange('monthlySalary', value)}
                      className={`border-primary/20 focus:border-primary ${errors.monthlySalary ? 'border-destructive' : ''}`}
                    />
                    {errors.monthlySalary && <p className="text-sm text-destructive">{errors.monthlySalary}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalCost" style={{ color: '#28314d' }}>
                      Custo Total (Salário + Encargos) *
                    </Label>
                    <CurrencyInput
                      id="totalCost"
                      value={formData.totalCost}
                      onChange={(value) => handleInputChange('totalCost', value)}
                      className={`border-primary/20 focus:border-primary ${errors.totalCost ? 'border-destructive' : ''}`}
                    />
                    {errors.totalCost && <p className="text-sm text-destructive">{errors.totalCost}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allocationRate" style={{ color: '#28314d' }}>
                      Taxa de Alocação *
                    </Label>
                    <PercentageInput
                      id="allocationRate"
                      value={formData.allocationRate}
                      onChange={(value) => handleInputChange('allocationRate', value)}
                      className={`border-primary/20 focus:border-primary ${errors.allocationRate ? 'border-destructive' : ''}`}
                    />
                    {errors.allocationRate && <p className="text-sm text-destructive">{errors.allocationRate}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* Aba 3: Informações de Contrato */}
              <TabsContent value="contract" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admissionDate" style={{ color: '#28314d' }}>
                      Data de Admissão *
                    </Label>
                    <DateInput
                      id="admissionDate"
                      value={formData.admissionDate}
                      onChange={(value) => handleInputChange('admissionDate', value)}
                      placeholder="DD/MM/AAAA"
                      className={`border-primary/20 focus:border-primary ${errors.admissionDate ? 'border-destructive' : ''}`}
                    />
                    {errors.admissionDate && <p className="text-sm text-destructive">{errors.admissionDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terminationDate" style={{ color: '#28314d' }}>
                      Data de Término
                    </Label>
                    <DateInput
                      id="terminationDate"
                      value={formData.terminationDate}
                      onChange={(value) => handleInputChange('terminationDate', value)}
                      placeholder="DD/MM/AAAA"
                      min={formData.admissionDate}
                      className={`border-primary/20 focus:border-primary ${errors.terminationDate ? 'border-destructive' : ''}`}
                    />
                    {errors.terminationDate && <p className="text-sm text-destructive">{errors.terminationDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractType" style={{ color: '#28314d' }}>
                      Tipo de Contrato *
                    </Label>
                    <Select
                      value={formData.contractType}
                      onValueChange={(value) => handleInputChange('contractType', value)}
                    >
                      <SelectTrigger className={`border-primary/20 focus:border-primary ${errors.contractType ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Selecione o tipo de contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLT">CLT</SelectItem>
                        <SelectItem value="PJ">PJ</SelectItem>
                        <SelectItem value="Estágio">Estágio</SelectItem>
                        <SelectItem value="Freelancer">Freelancer</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.contractType && <p className="text-sm text-destructive">{errors.contractType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probationPeriod" style={{ color: '#28314d' }}>
                      Período de Experiência (dias)
                    </Label>
                    <Input
                      id="probationPeriod"
                      type="number"
                      value={formData.probationPeriod}
                      onChange={(e) => handleInputChange('probationPeriod', e.target.value)}
                      placeholder="Ex: 90"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Aba 4: Dados Financeiros */}
              <TabsContent value="financial" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" style={{ color: '#28314d' }}>
                      CPF *
                    </Label>
                    <CPFInput
                      id="cpf"
                      value={formData.cpf}
                      onChange={(value) => handleInputChange('cpf', value)}
                      className={`border-primary/20 focus:border-primary ${errors.cpf ? 'border-destructive' : ''}`}
                    />
                    {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rg" style={{ color: '#28314d' }}>
                      RG *
                    </Label>
                    <RGInput
                      id="rg"
                      value={formData.rg}
                      onChange={(value) => handleInputChange('rg', value)}
                      className={`border-primary/20 focus:border-primary ${errors.rg ? 'border-destructive' : ''}`}
                    />
                    {errors.rg && <p className="text-sm text-destructive">{errors.rg}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank" style={{ color: '#28314d' }}>
                      Banco
                    </Label>
                    <Input
                      id="bank"
                      value={formData.bank}
                      onChange={(e) => handleInputChange('bank', e.target.value)}
                      placeholder="Nome do banco"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agency" style={{ color: '#28314d' }}>
                      Agência
                    </Label>
                    <Input
                      id="agency"
                      value={formData.agency}
                      onChange={(e) => handleInputChange('agency', e.target.value)}
                      placeholder="Número da agência"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account" style={{ color: '#28314d' }}>
                      Conta
                    </Label>
                    <Input
                      id="account"
                      value={formData.account}
                      onChange={(e) => handleInputChange('account', e.target.value)}
                      placeholder="Número da conta"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pisPasep" style={{ color: '#28314d' }}>
                      PIS/PASEP
                    </Label>
                    <Input
                      id="pisPasep"
                      value={formData.pisPasep}
                      onChange={(e) => handleInputChange('pisPasep', e.target.value)}
                      placeholder="000.00000.00-0"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Aba 5: Endereço */}
              <TabsContent value="address" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep" style={{ color: '#28314d' }}>
                      CEP *
                    </Label>
                    <CEPInput
                      id="cep"
                      value={formData.cep}
                      onChange={(value) => handleInputChange('cep', value)}
                      onAddressFound={handleAddressFound}
                      className={`border-primary/20 focus:border-primary ${errors.cep ? 'border-destructive' : ''}`}
                    />
                    {errors.cep && <p className="text-sm text-destructive">{errors.cep}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street" style={{ color: '#28314d' }}>
                      Rua/Logradouro *
                    </Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="Nome da rua"
                      className={`border-primary/20 focus:border-primary ${errors.street ? 'border-destructive' : ''}`}
                    />
                    {errors.street && <p className="text-sm text-destructive">{errors.street}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number" style={{ color: '#28314d' }}>
                      Número *
                    </Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      placeholder="Número"
                      className={`border-primary/20 focus:border-primary ${errors.number ? 'border-destructive' : ''}`}
                    />
                    {errors.number && <p className="text-sm text-destructive">{errors.number}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complement" style={{ color: '#28314d' }}>
                      Complemento
                    </Label>
                    <Input
                      id="complement"
                      value={formData.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      placeholder="Apto, Bloco, etc."
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood" style={{ color: '#28314d' }}>
                      Bairro *
                    </Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Nome do bairro"
                      className={`border-primary/20 focus:border-primary ${errors.neighborhood ? 'border-destructive' : ''}`}
                    />
                    {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" style={{ color: '#28314d' }}>
                      Cidade *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Nome da cidade"
                      className={`border-primary/20 focus:border-primary ${errors.city ? 'border-destructive' : ''}`}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" style={{ color: '#28314d' }}>
                      Estado *
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                      className={`border-primary/20 focus:border-primary ${errors.state ? 'border-destructive' : ''}`}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* Aba 6: Informações de Saúde */}
              <TabsContent value="health" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="allergies" style={{ color: '#28314d' }}>
                      Alergias
                    </Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="Liste as alergias conhecidas"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType" style={{ color: '#28314d' }}>
                      Tipo Sanguíneo
                    </Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => handleInputChange('bloodType', value)}
                    >
                      <SelectTrigger className="border-primary/20 focus:border-primary">
                        <SelectValue placeholder="Selecione o tipo sanguíneo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="Não informado">Não informado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthInsurance" style={{ color: '#28314d' }}>
                      Plano de Saúde
                    </Label>
                    <Input
                      id="healthInsurance"
                      value={formData.healthInsurance}
                      onChange={(e) => handleInputChange('healthInsurance', e.target.value)}
                      placeholder="Nome do plano de saúde"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="healthInsuranceNumber" style={{ color: '#28314d' }}>
                      Número do Plano de Saúde
                    </Label>
                    <Input
                      id="healthInsuranceNumber"
                      value={formData.healthInsuranceNumber}
                      onChange={(e) => handleInputChange('healthInsuranceNumber', e.target.value)}
                      placeholder="Número da carteirinha"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Aba 7: Histórico */}
              {isEdit && (
                <TabsContent value="history" className="space-y-4 mt-6">
                  <div className="space-y-6">
                    {/* Histórico de Salários */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: '#28314d' }}>
                        Histórico de Alterações de Salário
                      </h3>
                      {isEdit && id && (() => {
                        const collaborator = getCollaborators().find(c => c.id === id)
                        const history = collaborator?.salaryHistory || []
                        
                        if (history.length === 0) {
                          return (
                            <div className="border rounded-md p-4 text-center text-muted-foreground">
                              <p>Nenhuma alteração de salário registrada</p>
                            </div>
                          )
                        }
                        
                        return (
                          <div className="border rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Data</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Valor Anterior</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Novo Valor</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Motivo</th>
                                </tr>
                              </thead>
                              <tbody>
                                {history.map((item, index) => (
                                  <tr key={index} className="border-t">
                                    <td className="px-4 py-2 text-sm">
                                      {new Date(item.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-2 text-sm">R$ {item.previousValue}</td>
                                    <td className="px-4 py-2 text-sm font-medium">R$ {item.newValue}</td>
                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                      {item.reason || '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Histórico de Projetos */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: '#28314d' }}>
                        Histórico de Projetos
                      </h3>
                      {isEdit && id && (() => {
                        const projects = getAllProjectsByCollaborator(id)
                        const collaborator = getCollaborators().find(c => c.id === id)
                        const projectHistory = collaborator?.projectHistory || []
                        
                        // Combina histórico salvo com projetos atuais
                        const allProjects = [...projectHistory]
                        projects.forEach(project => {
                          if (!allProjects.find(p => p.projectId === project.id)) {
                            allProjects.push({
                              projectId: project.id,
                              projectName: project.projectName,
                              startDate: project.startDate,
                              endDate: project.endDate,
                              hourlyRate: project.collaboratorCosts?.[id] || collaborator?.hourlyRate || '0,00',
                              hoursWorked: undefined
                            })
                          }
                        })
                        
                        if (allProjects.length === 0) {
                          return (
                            <div className="border rounded-md p-4 text-center text-muted-foreground">
                              <p>Nenhum projeto registrado</p>
                            </div>
                          )
                        }
                        
                        return (
                          <div className="border rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Projeto</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Data Início</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Data Término</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Taxa/Hora</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Horas</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allProjects.map((item, index) => (
                                  <tr key={index} className="border-t">
                                    <td className="px-4 py-2 text-sm font-medium">{item.projectName}</td>
                                    <td className="px-4 py-2 text-sm">
                                      {new Date(item.startDate).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                      {item.endDate ? new Date(item.endDate).toLocaleDateString('pt-BR') : 'Em andamento'}
                                    </td>
                                    <td className="px-4 py-2 text-sm">R$ {item.hourlyRate}</td>
                                    <td className="px-4 py-2 text-sm text-muted-foreground">
                                      {item.hoursWorked ? `${item.hoursWorked}h` : '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            {/* Botões */}
            <div className="flex justify-between pt-6 mt-6 border-t">
              {isEdit && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Colaborador
                </Button>
              )}
              {!isEdit && <div />}
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Confirmação de Exclusão */}
        {isEdit && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  {!canDelete ? (
                    <div className="space-y-2">
                      <p className="text-destructive font-medium">
                        Não é possível deletar este colaborador pois ele está vinculado a projetos ativos:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {activeProjects.map((project, index) => (
                          <li key={index} className="text-sm">{project}</li>
                        ))}
                      </ul>
                      <p className="text-sm mt-2">
                        Finalize ou remova o colaborador desses projetos antes de deletá-lo.
                      </p>
                    </div>
                  ) : !deleteConfirmed ? (
                    'Tem certeza que deseja deletar este colaborador? Esta ação não pode ser desfeita.'
                  ) : (
                    'Esta é a confirmação final. Clique novamente em "Confirmar" para deletar permanentemente.'
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setDeleteConfirmed(false)
                    setActiveProjects([])
                  }}
                >
                  Cancelar
                </Button>
                {canDelete && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                  >
                    {deleteConfirmed ? 'Confirmar Exclusão' : 'Confirmar'}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default CollaboratorForm
