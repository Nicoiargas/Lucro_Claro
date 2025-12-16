import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { CPFInput } from '@/components/ui/cpf-input'
import { CNPJInput } from '@/components/ui/cnpj-input'
import { RGInput } from '@/components/ui/rg-input'
import { CEPInput } from '@/components/ui/cep-input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { PercentageInput } from '@/components/ui/percentage-input'
import { DateInput } from '@/components/ui/date-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Breadcrumbs from '@/components/Breadcrumbs'
import UserMenu from '@/components/UserMenu'
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
import { Trash2, Save, Plus } from 'lucide-react'
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
    personalEmail: '',
    email: '',
    phones: [''] as string[],
    role: '',
    status: 'available' as 'busy' | 'available',
    
    // Informações de Projeto
    hourlyRate: '', // Para PJ: valor mensal fixo
    monthlySalary: '',
    netSalary: '',
    invoiceValue: '',
    taxPercentage: '',
    materialSubscriptions: [{ id: 'swile-default', description: 'Swile', value: '' }] as Array<{ id: string; description: string; value: string }>,
    totalCost: '',
    // Breakdown de impostos
    inssValue: '',
    irrfValue: '',
    fgtsValue: '',
    
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
    cnpj: '',
    
    // Endereço
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Informações de Saúde
    allergies: [''] as string[],
    diseases: [''] as string[],
    medications: [''] as string[],
    emergencyContacts: [{ id: `default-${Date.now()}`, name: '', phone: '', relationship: '' }] as Array<{ id: string; name: string; phone: string; relationship: string }>,
    bloodType: '' as '' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Não informado',
    healthInsurance: '',
    healthInsuranceNumber: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  const [activeProjects, setActiveProjects] = useState<string[]>([])
  const [canDelete, setCanDelete] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  
  // Determina o tipo de contratação baseado no contractType
  // Funções para gerenciar alergias
  const addAllergy = () => {
    setFormData(prev => ({
      ...prev,
      allergies: [...prev.allergies, '']
    }))
  }

  const removeAllergy = (index: number) => {
    setFormData(prev => {
      // Garante que sempre haja pelo menos um campo
      if (prev.allergies.length <= 1) {
        return prev
      }
      return {
        ...prev,
        allergies: prev.allergies.filter((_, i) => i !== index)
      }
    })
  }

  const updateAllergy = (index: number, value: string) => {
    setFormData(prev => {
      const newAllergies = [...prev.allergies]
      newAllergies[index] = value
      return { ...prev, allergies: newAllergies }
    })
  }

  // Funções para gerenciar doenças
  const addDisease = () => {
    setFormData(prev => ({
      ...prev,
      diseases: [...prev.diseases, '']
    }))
  }

  const removeDisease = (index: number) => {
    setFormData(prev => {
      // Garante que sempre haja pelo menos um campo
      if (prev.diseases.length <= 1) {
        return prev
      }
      return {
        ...prev,
        diseases: prev.diseases.filter((_, i) => i !== index)
      }
    })
  }

  const updateDisease = (index: number, value: string) => {
    setFormData(prev => {
      const newDiseases = [...prev.diseases]
      newDiseases[index] = value
      return { ...prev, diseases: newDiseases }
    })
  }

  // Funções para gerenciar remédios
  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, '']
    }))
  }

  const removeMedication = (index: number) => {
    setFormData(prev => {
      // Garante que sempre haja pelo menos um campo
      if (prev.medications.length <= 1) {
        return prev
      }
      return {
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }
    })
  }

  const updateMedication = (index: number, value: string) => {
    setFormData(prev => {
      const newMedications = [...prev.medications]
      newMedications[index] = value
      return { ...prev, medications: newMedications }
    })
  }

  // Funções para gerenciar contatos de emergência
  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { id: Date.now().toString(), name: '', phone: '', relationship: '' }
      ]
    }))
  }

  const removeEmergencyContact = (id: string) => {
    setFormData(prev => {
      // Garante que sempre haja pelo menos um campo
      if (prev.emergencyContacts.length <= 1) {
        return prev
      }
      return {
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter(item => item.id !== id)
      }
    })
  }

  const updateEmergencyContact = (id: string, field: 'name' | 'phone' | 'relationship', value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const getHonorariosContractType = (): 'PJ' | 'CLT' => {
    if (formData.contractType === 'PJ') return 'PJ'
    if (formData.contractType === 'CLT') return 'CLT'
    // Default para CLT se não estiver definido
    return 'CLT'
  }

  // Funções de cálculo de impostos CLT
  const calculateINSS = (bruto: number): number => {
    if (bruto <= 1412.00) {
      return bruto * 0.075
    } else if (bruto <= 2666.68) {
      return 1412.00 * 0.075 + (bruto - 1412.00) * 0.09
    } else if (bruto <= 4000.03) {
      return 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (bruto - 2666.68) * 0.12
    } else if (bruto <= 7786.02) {
      return 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (4000.03 - 2666.68) * 0.12 + (bruto - 4000.03) * 0.14
    } else {
      return 908.85 // Teto do INSS
    }
  }

  const calculateIRRF = (baseCalculo: number): number => {
    if (baseCalculo <= 2112.00) {
      return 0
    } else if (baseCalculo <= 2826.65) {
      return (baseCalculo - 2112.00) * 0.075
    } else if (baseCalculo <= 3751.05) {
      return (2826.65 - 2112.00) * 0.075 + (baseCalculo - 2826.65) * 0.15
    } else if (baseCalculo <= 4664.68) {
      return (2826.65 - 2112.00) * 0.075 + (3751.05 - 2826.65) * 0.15 + (baseCalculo - 3751.05) * 0.225
    } else {
      return (2826.65 - 2112.00) * 0.075 + (3751.05 - 2826.65) * 0.15 + (4664.68 - 3751.05) * 0.225 + (baseCalculo - 4664.68) * 0.275
    }
  }

  const calculateFGTS = (bruto: number): number => {
    return bruto * 0.08
  }

  // Cálculo reverso: dado o líquido, encontra o bruto
  const calculateCLTReverse = (liquido: number): { bruto: number; inss: number; irrf: number; fgts: number } => {
    // Usa iteração para encontrar o bruto que resulta no líquido desejado
    let bruto = liquido
    let tolerance = 0.01
    let maxIterations = 100
    let iteration = 0

    while (iteration < maxIterations) {
      const inss = calculateINSS(bruto)
      const baseIRRF = bruto - inss
      const irrf = calculateIRRF(baseIRRF)
      const calculadoLiquido = bruto - inss - irrf

      const diff = Math.abs(calculadoLiquido - liquido)
      
      if (diff < tolerance) {
        const fgts = calculateFGTS(bruto)
        return { bruto, inss, irrf, fgts }
      }

      // Ajusta o bruto baseado na diferença
      bruto = bruto + (liquido - calculadoLiquido) * 1.5
      iteration++
    }

    // Se não convergiu, retorna valores aproximados
    const inss = calculateINSS(bruto)
    const baseIRRF = bruto - inss
    const irrf = calculateIRRF(baseIRRF)
    const fgts = calculateFGTS(bruto)
    return { bruto, inss, irrf, fgts }
  }

  const formatCurrency = (value: number): string => {
    if (value === 0) return ''
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const parseCurrency = (value: string): number => {
    if (!value) return 0
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(cleaned) || 0
  }

  const parsePercentage = (value: string): number => {
    if (!value) return 0
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(cleaned) || 0
  }

  // Funções para gerenciar Material e Assinaturas
  const addMaterialSubscription = () => {
    setFormData(prev => ({
      ...prev,
      materialSubscriptions: [
        ...prev.materialSubscriptions,
        { id: Date.now().toString(), description: '', value: '' }
      ]
    }))
  }

  const removeMaterialSubscription = (id: string) => {
    // Garante que sempre haja pelo menos um campo
    if (formData.materialSubscriptions.length <= 1) {
      return
    }
    setFormData(prev => {
      const updated = {
        ...prev,
        materialSubscriptions: prev.materialSubscriptions.filter(item => item.id !== id)
      }
      
      // Recalcula o total
      const contractType = prev.contractType === 'PJ' ? 'PJ' : prev.contractType === 'CLT' ? 'CLT' : 'CLT'
      const materialTotal = updated.materialSubscriptions.reduce(
        (sum, item) => sum + parseCurrency(item.value),
        0
      )
      
      if (contractType === 'CLT' && updated.monthlySalary) {
        const bruto = parseCurrency(updated.monthlySalary)
        const fgts = parseCurrency(updated.fgtsValue)
        const total = bruto + fgts + materialTotal
        updated.totalCost = formatCurrency(total)
      } else if (contractType === 'PJ') {
        // Calcula baseado em valor mensal fixo
        const monthlyValue = parseCurrency(updated.hourlyRate)
        const total = monthlyValue + materialTotal
        updated.totalCost = formatCurrency(total)
      }
      
      return updated
    })
  }

  const updateMaterialSubscription = (id: string, field: 'description' | 'value', newValue: string) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        materialSubscriptions: prev.materialSubscriptions.map(item =>
          item.id === id ? { ...item, [field]: newValue } : item
        )
      }
      
      // Recalcula o total quando o valor muda
      if (field === 'value') {
        const contractType = getHonorariosContractType()
        const materialTotal = updated.materialSubscriptions.reduce(
          (sum, item) => sum + parseCurrency(item.value),
          0
        )
        
        if (contractType === 'CLT' && updated.monthlySalary) {
          const bruto = parseCurrency(updated.monthlySalary)
          const fgts = parseCurrency(updated.fgtsValue)
          const total = bruto + fgts + materialTotal
          updated.totalCost = formatCurrency(total)
        } else if (contractType === 'PJ') {
          // Calcula baseado em valor mensal fixo
          const monthlyValue = parseCurrency(updated.hourlyRate)
          const total = monthlyValue + materialTotal
          updated.totalCost = formatCurrency(total)
        }
      }
      
      return updated
    })
  }

  const calculateMaterialTotal = (): number => {
    return formData.materialSubscriptions.reduce(
      (sum, item) => sum + parseCurrency(item.value),
      0
    )
  }

  const calculateTotalCost = (monthlySalary: string, taxPercentage: string, materialSubscriptions: string): string => {
    const salary = parseCurrency(monthlySalary)
    const taxPercent = parsePercentage(taxPercentage)
    const material = parseCurrency(materialSubscriptions)
    
    const taxAmount = salary * (taxPercent / 100)
    const total = salary + taxAmount + material
    
    return formatCurrency(total)
  }

  useEffect(() => {
    if (isEdit && id) {
      const collaborators = getCollaborators()
      const collaborator = collaborators.find(c => c.id === id)
      if (collaborator) {
        setFormData({
          name: collaborator.name || '',
          personalEmail: collaborator.personalEmail || '',
          email: collaborator.email || '',
          phones: Array.isArray(collaborator.phone) ? collaborator.phone : collaborator.phone ? [collaborator.phone] : [''],
          role: collaborator.role || '',
          status: collaborator.status || 'available',
          hourlyRate: collaborator.hourlyRate || '',
          monthlySalary: collaborator.monthlySalary || '',
          netSalary: collaborator.netSalary || '',
          invoiceValue: collaborator.invoiceValue || '',
          taxPercentage: collaborator.taxPercentage || '',
          materialSubscriptions: (() => {
            const existing = Array.isArray(collaborator.materialSubscriptions)
              ? collaborator.materialSubscriptions
              : collaborator.materialSubscriptions
                ? [{ id: Date.now().toString(), description: 'Material e Assinaturas', value: collaborator.materialSubscriptions }]
                : []
            // Garante que sempre tenha o campo Swile
            const hasSwile = existing.some(item => item.description === 'Swile')
            if (!hasSwile) {
              return [{ id: 'swile-default', description: 'Swile', value: '' }, ...existing]
            }
            return existing
          })(),
          totalCost: collaborator.totalCost || '',
          inssValue: collaborator.inssValue || '',
          irrfValue: collaborator.irrfValue || '',
          fgtsValue: collaborator.fgtsValue || '',
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
          cnpj: collaborator.cnpj || '',
          cep: collaborator.cep || '',
          street: collaborator.street || '',
          number: collaborator.number || '',
          complement: collaborator.complement || '',
          neighborhood: collaborator.neighborhood || '',
          city: collaborator.city || '',
          state: collaborator.state || '',
          allergies: (() => {
            const existing = Array.isArray(collaborator.allergies) 
              ? collaborator.allergies 
              : collaborator.allergies 
                ? [collaborator.allergies] 
                : []
            // Garante que sempre haja pelo menos um campo vazio
            return existing.length > 0 ? existing : ['']
          })(),
          diseases: (() => {
            const existing = Array.isArray(collaborator.diseases) 
              ? collaborator.diseases 
              : []
            // Garante que sempre haja pelo menos um campo vazio
            return existing.length > 0 ? existing : ['']
          })(),
          medications: (() => {
            const existing = Array.isArray(collaborator.medications) 
              ? collaborator.medications 
              : []
            // Garante que sempre haja pelo menos um campo vazio
            return existing.length > 0 ? existing : ['']
          })(),
          emergencyContacts: (() => {
            const existing = Array.isArray(collaborator.emergencyContacts) 
              ? collaborator.emergencyContacts 
              : []
            // Garante que sempre haja pelo menos um campo vazio
            return existing.length > 0 ? existing : [{ id: `default-${Date.now()}`, name: '', phone: '', relationship: '' }]
          })(),
          bloodType: collaborator.bloodType || '',
          healthInsurance: collaborator.healthInsurance || '',
          healthInsuranceNumber: collaborator.healthInsuranceNumber || '',
        })
        
        // Calcula o totalCost se houver dados (modo legado)
        if (collaborator.monthlySalary || collaborator.taxPercentage) {
          const materialValue = typeof collaborator.materialSubscriptions === 'string' 
            ? collaborator.materialSubscriptions 
            : Array.isArray(collaborator.materialSubscriptions)
              ? collaborator.materialSubscriptions.reduce((sum, item) => sum + parseCurrency(item.value), 0).toString()
              : ''
          const calculated = calculateTotalCost(
            collaborator.monthlySalary || '',
            collaborator.taxPercentage || '',
            materialValue
          )
          if (calculated) {
            setFormData(prev => ({ ...prev, totalCost: calculated }))
          }
        }
      }
    }
  }, [isEdit, id])

  // Recalcula quando o tipo de contrato muda (apenas se houver dados)
  useEffect(() => {
    const contractType = getHonorariosContractType()
    const materialTotal = formData.materialSubscriptions.reduce(
      (sum, item) => sum + parseCurrency(item.value),
      0
    )
    
    if (contractType === 'CLT' && formData.netSalary) {
      const liquido = parseCurrency(formData.netSalary)
      if (liquido > 0) {
        const { bruto, inss, irrf, fgts } = calculateCLTReverse(liquido)
        const newBruto = formatCurrency(bruto)
        const newInss = formatCurrency(inss)
        const newIrrf = formatCurrency(irrf)
        const newFgts = formatCurrency(fgts)
        const newTotal = formatCurrency(bruto + fgts + materialTotal)
        
        setFormData(prev => {
          // Só atualiza se os valores mudaram para evitar loops
          if (prev.monthlySalary !== newBruto || prev.totalCost !== newTotal) {
            return {
              ...prev,
              monthlySalary: newBruto,
              inssValue: newInss,
              irrfValue: newIrrf,
              fgtsValue: newFgts,
              totalCost: newTotal
            }
          }
          return prev
        })
      }
    } else if (contractType === 'PJ') {
      // Calcula baseado em valor mensal fixo
      const monthlyValue = parseCurrency(formData.hourlyRate)
      const newTotal = formatCurrency(monthlyValue + materialTotal)
      
      setFormData(prev => {
        if (prev.totalCost !== newTotal) {
          return { ...prev, totalCost: newTotal }
        }
        return prev
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.contractType, formData.materialSubscriptions, formData.hourlyRate])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      const contractType = field === 'contractType' ? (value as 'PJ' | 'CLT' | '') : prev.contractType
      const honorariosType = contractType === 'PJ' ? 'PJ' : contractType === 'CLT' ? 'CLT' : 'CLT'
      
      // Limpa campos quando muda o tipo de contrato
      if (field === 'contractType') {
        if (value === 'PJ') {
          updated.netSalary = ''
          updated.monthlySalary = ''
          updated.inssValue = ''
          updated.irrfValue = ''
          updated.fgtsValue = ''
        } else if (value === 'CLT') {
          updated.hourlyRate = ''
        }
      }
      
      // Cálculo para CLT: quando líquido muda, calcula bruto e impostos
      if (honorariosType === 'CLT' && field === 'netSalary') {
        const liquido = parseCurrency(value)
        if (liquido > 0) {
          const { bruto, inss, irrf, fgts } = calculateCLTReverse(liquido)
          updated.monthlySalary = formatCurrency(bruto)
          updated.inssValue = formatCurrency(inss)
          updated.irrfValue = formatCurrency(irrf)
          updated.fgtsValue = formatCurrency(fgts)
          
          const materialTotal = updated.materialSubscriptions.reduce(
            (sum, item) => sum + parseCurrency(item.value),
            0
          )
          const total = bruto + fgts + materialTotal
          updated.totalCost = formatCurrency(total)
        } else {
          updated.monthlySalary = ''
          updated.inssValue = ''
          updated.irrfValue = ''
          updated.fgtsValue = ''
          updated.totalCost = ''
        }
      }
      
      // Cálculo para PJ: quando valor mensal muda
      if (honorariosType === 'PJ' && field === 'hourlyRate') {
        const materialTotal = updated.materialSubscriptions.reduce(
          (sum, item) => sum + parseCurrency(item.value),
          0
        )
        
        // Calcula baseado em valor mensal fixo
        const monthlyValue = parseCurrency(value)
        const total = monthlyValue + materialTotal
        updated.totalCost = formatCurrency(total)
      }
      
      // Modo legado: calcula o totalCost automaticamente quando monthlySalary ou taxPercentage mudam
      if (field === 'monthlySalary' || field === 'taxPercentage') {
        if (!updated.netSalary && !updated.invoiceValue) {
          const materialTotal = updated.materialSubscriptions.reduce(
            (sum, item) => sum + parseCurrency(item.value),
            0
          )
          updated.totalCost = calculateTotalCost(
            field === 'monthlySalary' ? value : updated.monthlySalary,
            field === 'taxPercentage' ? value : updated.taxPercentage,
            formatCurrency(materialTotal)
          )
        }
      }
      
      return updated
    })
    // Remove erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePhoneChange = (index: number, value: string) => {
    setFormData(prev => {
      const newPhones = [...prev.phones]
      newPhones[index] = value
      return { ...prev, phones: newPhones }
    })
    // Remove erro do campo quando usuário começa a digitar
    if (errors[`phone-${index}`] || errors.phone) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`phone-${index}`]
        delete newErrors.phone
        return newErrors
      })
    }
  }

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }))
  }

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      setFormData(prev => {
        const newPhones = prev.phones.filter((_, i) => i !== index)
        return { ...prev, phones: newPhones }
      })
      // Remove erro do campo removido
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`phone-${index}`]
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
    if (formData.personalEmail && !validateEmail(formData.personalEmail)) {
      newErrors.personalEmail = 'Email pessoal inválido'
    }
    if (!formData.email) {
      newErrors.email = 'Email profissional é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email profissional inválido'
    }
    // Validação de telefones - pelo menos um telefone é obrigatório
    const validPhones = formData.phones.filter(phone => phone.trim() !== '')
    if (validPhones.length === 0) {
      newErrors.phone = 'Pelo menos um telefone é obrigatório'
    }
    if (!formData.role) newErrors.role = 'Cargo/Função é obrigatório'
    
    // Informações de Horários (validação baseada no tipo de contratação)
    const honorariosType = getHonorariosContractType()
    if (honorariosType === 'CLT') {
      if (!formData.netSalary) {
        newErrors.netSalary = 'Salário líquido é obrigatório para CLT'
      } else {
        const liquido = parseCurrency(formData.netSalary)
        if (liquido <= 0) {
          newErrors.netSalary = 'Salário líquido deve ser maior que zero'
        }
      }
      if (!formData.monthlySalary) {
        newErrors.monthlySalary = 'Salário bruto não pôde ser calculado'
      }
    } else {
      // PJ - deve ter valor mensal
      const monthlyValue = parseCurrency(formData.hourlyRate)
      
      if (!formData.hourlyRate || monthlyValue <= 0) {
        newErrors.hourlyRate = 'Valor Mensal é obrigatório para PJ'
      }
    }
    
    if (!formData.totalCost) {
      newErrors.totalCost = 'Custo total é obrigatório'
    }
    
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

  const handleAdvance = () => {
    const tabs = isEdit 
      ? ['personal', 'contract', 'financial', 'address', 'health', 'history']
      : ['personal', 'contract', 'financial', 'address', 'health']
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleSave = () => {
    if (!validateForm()) {
      alert('Por favor, corrija os erros no formulário')
      return
    }

    const validPhones = formData.phones.filter(phone => phone.trim() !== '')
    const phoneValue = validPhones.length === 1 ? validPhones[0] : validPhones

    const collaboratorData: Omit<Collaborator, 'id'> = {
      name: formData.name,
      personalEmail: formData.personalEmail || undefined,
      email: formData.email,
      phone: phoneValue,
      role: formData.role,
      status: formData.status,
      hourlyRate: formData.hourlyRate || undefined,
      monthlySalary: formData.monthlySalary || undefined,
      netSalary: formData.netSalary || undefined,
      invoiceValue: formData.invoiceValue || undefined,
      taxPercentage: formData.taxPercentage || undefined,
      materialSubscriptions: formData.materialSubscriptions.length > 0 ? formData.materialSubscriptions : undefined,
      totalCost: formData.totalCost,
      inssValue: formData.inssValue || undefined,
      irrfValue: formData.irrfValue || undefined,
      fgtsValue: formData.fgtsValue || undefined,
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
      cnpj: formData.cnpj || undefined,
      cep: formData.cep,
      street: formData.street,
      number: formData.number,
      complement: formData.complement || undefined,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      allergies: formData.allergies.filter(a => a.trim() !== '').length > 0 
        ? formData.allergies.filter(a => a.trim() !== '') 
        : undefined,
      diseases: formData.diseases.filter(d => d.trim() !== '').length > 0 
        ? formData.diseases.filter(d => d.trim() !== '') 
        : undefined,
      medications: formData.medications.filter(m => m.trim() !== '').length > 0 
        ? formData.medications.filter(m => m.trim() !== '') 
        : undefined,
      emergencyContacts: formData.emergencyContacts.filter(c => c.name.trim() !== '' || c.phone.trim() !== '' || c.relationship.trim() !== '').length > 0 
        ? formData.emergencyContacts.filter(c => c.name.trim() !== '' || c.phone.trim() !== '' || c.relationship.trim() !== '') 
        : undefined,
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
        {/* Header com Logo e Menu do Usuário */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
            <img 
              src="/logo2.svg" 
              alt="Lucro Claro" 
              style={{ height: '50px', width: 'auto' }}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <UserMenu />
          </div>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`!grid !w-full gap-1 ${isEdit ? 'grid-cols-6' : 'grid-cols-5'} !h-auto p-1`}>
                <TabsTrigger value="personal" className="text-xs px-2 py-2 whitespace-normal text-center leading-tight min-h-[2.5rem] w-full flex items-center justify-center">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="contract" className="text-xs px-2 py-2 whitespace-normal text-center leading-tight min-h-[2.5rem] w-full flex items-center justify-center">Contrato</TabsTrigger>
                <TabsTrigger value="financial" className="text-xs px-2 py-2 whitespace-normal text-center leading-tight min-h-[2.5rem] w-full flex items-center justify-center">Financeiro</TabsTrigger>
                <TabsTrigger value="address" className="text-xs px-2 py-2 whitespace-normal text-center leading-tight min-h-[2.5rem] w-full flex items-center justify-center">Endereço</TabsTrigger>
                <TabsTrigger value="health" className="text-xs px-2 py-2 whitespace-normal text-center leading-tight min-h-[2.5rem] w-full flex items-center justify-center">Saúde</TabsTrigger>
                {isEdit && <TabsTrigger value="history" className="text-xs px-2 py-2 whitespace-normal text-center leading-tight min-h-[2.5rem] w-full flex items-center justify-center">Histórico</TabsTrigger>}
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
                    <Label htmlFor="personalEmail" style={{ color: '#28314d' }}>
                      Email Pessoal
                    </Label>
                    <Input
                      id="personalEmail"
                      type="email"
                      value={formData.personalEmail}
                      onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                      placeholder="email.pessoal@email.com"
                      className={`border-primary/20 focus:border-primary ${errors.personalEmail ? 'border-destructive' : ''}`}
                    />
                    {errors.personalEmail && <p className="text-sm text-destructive">{errors.personalEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" style={{ color: '#28314d' }}>
                      Email Profissional *
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
                    <Label style={{ color: '#28314d' }}>
                      Telefone(s) *
                    </Label>
                    <div className="space-y-2">
                      {formData.phones.map((phone, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1">
                            <PhoneInput
                              id={`phone-${index}`}
                              value={phone}
                              onChange={(value) => handlePhoneChange(index, value)}
                              className={`border-primary/20 focus:border-primary ${errors[`phone-${index}`] || errors.phone ? 'border-destructive' : ''}`}
                            />
                          </div>
                          {formData.phones.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removePhone(index)}
                              className="mt-0 h-10 w-10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {index === formData.phones.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={addPhone}
                              className="mt-0 h-10 w-10"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
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

              {/* Aba 2: Contrato */}
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

                {/* Horários */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#28314d' }}>
                    Horários
                  </h3>
                  {!formData.contractType && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Selecione o tipo de contrato acima para configurar os horários
                    </p>
                  )}

                  {getHonorariosContractType() === 'CLT' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="netSalary" style={{ color: '#28314d' }}>
                            Salário Líquido *
                          </Label>
                          <CurrencyInput
                            id="netSalary"
                            value={formData.netSalary}
                            onChange={(value) => handleInputChange('netSalary', value)}
                            className={`border-primary/20 focus:border-primary ${errors.netSalary ? 'border-destructive' : ''}`}
                            placeholder="Valor que o profissional recebe"
                          />
                          {errors.netSalary && <p className="text-sm text-destructive">{errors.netSalary}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="monthlySalary" style={{ color: '#28314d' }}>
                            Salário Bruto (calculado)
                          </Label>
                          <CurrencyInput
                            id="monthlySalary"
                            value={formData.monthlySalary}
                            readOnly
                            className="border-primary/20 bg-muted cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {formData.inssValue && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold mb-2" style={{ color: '#28314d' }}>
                            Impostos:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">INSS:</span>{' '}
                              <span className="font-medium">R$ {formData.inssValue}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">IRRF:</span>{' '}
                              <span className="font-medium">R$ {formData.irrfValue}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">FGTS:</span>{' '}
                              <span className="font-medium">R$ {formData.fgtsValue}</span>
                              <span className="text-xs text-muted-foreground ml-1">(8% sobre bruto)</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label style={{ color: '#28314d' }}>
                              Material e Assinaturas
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addMaterialSubscription}
                              className="h-8"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData.materialSubscriptions.map((item, index) => (
                              <div key={item.id} className="flex gap-2 items-start">
                                <div className="flex-1 flex gap-2">
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateMaterialSubscription(item.id, 'description', e.target.value)}
                                    placeholder="Descrição (ex: Assinatura Adobe)"
                                    className="border-primary/20 focus:border-primary flex-[3]"
                                  />
                                  <CurrencyInput
                                    value={item.value}
                                    onChange={(value) => updateMaterialSubscription(item.id, 'value', value)}
                                    className="border-primary/20 focus:border-primary flex-[1]"
                                    placeholder="Valor"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeMaterialSubscription(item.id)}
                                  disabled={formData.materialSubscriptions.length <= 1}
                                  className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {formData.materialSubscriptions.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Nenhum item adicionado. Clique em "Adicionar" para incluir custos de material e assinaturas.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="totalCost" style={{ color: '#28314d' }}>
                            Custo Total (calculado) *
                          </Label>
                          <CurrencyInput
                            id="totalCost"
                            value={formData.totalCost}
                            readOnly
                            className="border-primary/20 bg-muted cursor-not-allowed"
                          />
                          {errors.totalCost && <p className="text-sm text-destructive">{errors.totalCost}</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate" style={{ color: '#28314d' }}>
                            Valor Mensal *
                          </Label>
                          <CurrencyInput
                            id="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={(value) => handleInputChange('hourlyRate', value)}
                            className={`border-primary/20 focus:border-primary ${errors.hourlyRate ? 'border-destructive' : ''}`}
                            placeholder="Ex: 15.000,00"
                          />
                          {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label style={{ color: '#28314d' }}>
                              Material e Assinaturas
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addMaterialSubscription}
                              className="h-8"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData.materialSubscriptions.map((item, index) => (
                              <div key={item.id} className="flex gap-2 items-start">
                                <div className="flex-1 flex gap-2">
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateMaterialSubscription(item.id, 'description', e.target.value)}
                                    placeholder="Descrição (ex: Assinatura Adobe)"
                                    className="border-primary/20 focus:border-primary flex-[3]"
                                  />
                                  <CurrencyInput
                                    value={item.value}
                                    onChange={(value) => updateMaterialSubscription(item.id, 'value', value)}
                                    className="border-primary/20 focus:border-primary flex-[1]"
                                    placeholder="Valor"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeMaterialSubscription(item.id)}
                                  disabled={formData.materialSubscriptions.length <= 1}
                                  className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {formData.materialSubscriptions.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Nenhum item adicionado. Clique em "Adicionar" para incluir custos de material e assinaturas.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="totalCost" style={{ color: '#28314d' }}>
                            Custo Total (calculado) *
                          </Label>
                          <CurrencyInput
                            id="totalCost"
                            value={formData.totalCost}
                            readOnly
                            className="border-primary/20 bg-muted cursor-not-allowed"
                          />
                          {errors.totalCost && <p className="text-sm text-destructive">{errors.totalCost}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                  </div>
                </div>
              </TabsContent>

              {/* Aba 3: Dados Financeiros */}
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

                  {formData.contractType === 'CLT' && (
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
                  )}

                  {formData.contractType === 'PJ' && (
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" style={{ color: '#28314d' }}>
                        CNPJ
                      </Label>
                      <CNPJInput
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(value) => handleInputChange('cnpj', value)}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Aba 4: Endereço */}
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

              {/* Aba 5: Informações de Saúde */}
              <TabsContent value="health" className="space-y-4 mt-6">
                <div className="space-y-6">
                  {/* Alergias */}
                  <div className="space-y-2">
                    <Label style={{ color: '#28314d' }}>
                      Alergias
                    </Label>
                    <div className="space-y-2">
                      {formData.allergies.map((allergy, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={allergy}
                            onChange={(e) => updateAllergy(index, e.target.value)}
                            placeholder="Nome da alergia"
                            className="border-primary/20 focus:border-primary flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addAllergy}
                            className="h-10 w-10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeAllergy(index)}
                            disabled={formData.allergies.length <= 1}
                            className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doenças */}
                  <div className="space-y-2">
                    <Label style={{ color: '#28314d' }}>
                      Doenças
                    </Label>
                    <div className="space-y-2">
                      {formData.diseases.map((disease, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={disease}
                            onChange={(e) => updateDisease(index, e.target.value)}
                            placeholder="Nome da doença"
                            className="border-primary/20 focus:border-primary flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addDisease}
                            className="h-10 w-10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeDisease(index)}
                            disabled={formData.diseases.length <= 1}
                            className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remédios */}
                  <div className="space-y-2">
                    <Label style={{ color: '#28314d' }}>
                      Remédios que Usa
                    </Label>
                    <div className="space-y-2">
                      {formData.medications.map((medication, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={medication}
                            onChange={(e) => updateMedication(index, e.target.value)}
                            placeholder="Nome do remédio"
                            className="border-primary/20 focus:border-primary flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addMedication}
                            className="h-10 w-10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeMedication(index)}
                            disabled={formData.medications.length <= 1}
                            className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contatos de Emergência */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label style={{ color: '#28314d' }}>
                        Contatos de Emergência
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addEmergencyContact}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const lastContact = formData.emergencyContacts[formData.emergencyContacts.length - 1]
                            if (lastContact) {
                              removeEmergencyContact(lastContact.id)
                            }
                          }}
                          disabled={formData.emergencyContacts.length <= 1}
                          className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formData.emergencyContacts.map((contact) => (
                        <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Nome</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                              placeholder="Nome completo"
                              className="border-primary/20 focus:border-primary h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Telefone</Label>
                            <PhoneInput
                              value={contact.phone}
                              onChange={(value) => updateEmergencyContact(contact.id, 'phone', value)}
                              className="border-primary/20 focus:border-primary h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Relação</Label>
                            <Input
                              value={contact.relationship}
                              onChange={(e) => updateEmergencyContact(contact.id, 'relationship', e.target.value)}
                              placeholder="Ex: Pai, Mãe, Cônjuge"
                              className="border-primary/20 focus:border-primary h-10"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campos existentes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </TabsContent>

              {/* Aba 6: Histórico */}
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
                onClick={activeTab === 'health' ? handleSave : handleAdvance}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
              >
                <Save className="h-4 w-4" />
                {activeTab === 'health' ? 'Salvar' : 'Avançar'}
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
