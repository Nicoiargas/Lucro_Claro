// Utilitário para gerenciar colaboradores no localStorage
// Isso será substituído por uma API real no futuro

export interface SalaryHistoryItem {
  date: string
  previousValue: string
  newValue: string
  reason?: string
}

export interface ProjectHistoryItem {
  projectId: string
  projectName: string
  startDate: string
  endDate?: string
  hourlyRate: string
  hoursWorked?: number
}

export interface Collaborator {
  id: string
  // Dados Pessoais
  name: string
  email: string
  phone: string
  role: string
  status: 'busy' | 'available'
  
  // Informações de Projeto
  hourlyRate?: string // Salário/hora
  monthlySalary?: string // Salário mensal
  totalCost?: string // Custo total
  allocationRate?: string // Taxa de alocação (%)
  
  // Informações de Contrato
  admissionDate?: string
  terminationDate?: string
  contractType?: 'CLT' | 'PJ' | 'Estágio' | 'Freelancer' | 'Outro'
  probationPeriod?: number // dias
  
  // Dados Financeiros
  cpf?: string
  rg?: string
  bank?: string
  agency?: string
  account?: string
  pisPasep?: string
  
  // Endereço
  cep?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  
  // Informações de Saúde
  allergies?: string
  bloodType?: string
  healthInsurance?: string
  healthInsuranceNumber?: string
  
  // Histórico
  salaryHistory?: SalaryHistoryItem[]
  projectHistory?: ProjectHistoryItem[]
  
  currentProject?: string
}

const STORAGE_KEY = 'lucroclaro_collaborators'

export const getCollaborators = (): Collaborator[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Dados iniciais mockados
    const initial: Collaborator[] = [
      {
        id: '1',
        name: 'João Silva',
        role: 'Desenvolvedor Full Stack',
        email: 'joao.silva@example.com',
        phone: '(11) 99999-9999',
        status: 'busy',
        currentProject: 'Sistema de Gestão ERP',
        hourlyRate: '150,00',
        monthlySalary: '12.000,00',
        totalCost: '15.000,00',
        allocationRate: '100%',
        admissionDate: '2023-01-15',
        contractType: 'CLT',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        id: '2',
        name: 'Maria Santos',
        role: 'Designer UX/UI',
        email: 'maria.santos@example.com',
        phone: '(11) 98888-8888',
        status: 'busy',
        currentProject: 'Plataforma E-commerce',
        hourlyRate: '120,00',
        monthlySalary: '10.000,00',
        totalCost: '12.500,00',
        allocationRate: '100%',
        admissionDate: '2023-02-01',
        contractType: 'CLT',
        cpf: '234.567.890-11',
        rg: '23.456.789-0',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '200',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        role: 'Desenvolvedor Mobile',
        email: 'pedro.oliveira@example.com',
        phone: '(11) 97777-7777',
        status: 'busy',
        currentProject: 'App Mobile iOS/Android',
        hourlyRate: '140,00',
        monthlySalary: '11.000,00',
        totalCost: '13.750,00',
        allocationRate: '100%',
        admissionDate: '2023-03-10',
        contractType: 'PJ',
        cpf: '345.678.901-22',
        rg: '34.567.890-1',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '1500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        id: '4',
        name: 'Ana Costa',
        role: 'Product Manager',
        email: 'ana.costa@example.com',
        phone: '(11) 96666-6666',
        status: 'available',
        hourlyRate: '180,00',
        monthlySalary: '15.000,00',
        totalCost: '18.750,00',
        allocationRate: '100%',
        admissionDate: '2023-04-05',
        contractType: 'CLT',
        cpf: '456.789.012-33',
        rg: '45.678.901-2',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '2000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        id: '5',
        name: 'Carlos Ferreira',
        role: 'Desenvolvedor Backend',
        email: 'carlos.ferreira@example.com',
        phone: '(11) 95555-5555',
        status: 'busy',
        currentProject: 'Sistema de BI',
        hourlyRate: '160,00',
        monthlySalary: '13.000,00',
        totalCost: '16.250,00',
        allocationRate: '100%',
        admissionDate: '2023-05-20',
        contractType: 'CLT',
        cpf: '567.890.123-44',
        rg: '56.789.012-3',
        cep: '04547-130',
        street: 'Rua Funchal',
        number: '300',
        neighborhood: 'Vila Olímpia',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        id: '6',
        name: 'Julia Almeida',
        role: 'QA Tester',
        email: 'julia.almeida@example.com',
        phone: '(11) 94444-4444',
        status: 'available',
        hourlyRate: '100,00',
        monthlySalary: '8.000,00',
        totalCost: '10.000,00',
        allocationRate: '100%',
        admissionDate: '2023-06-15',
        contractType: 'CLT',
        cpf: '678.901.234-55',
        rg: '67.890.123-4',
        cep: '05433-000',
        street: 'Avenida Brigadeiro Faria Lima',
        number: '2500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP'
      },
      {
        id: '7',
        name: 'Roberto Lima',
        role: 'DevOps Engineer',
        email: 'roberto.lima@example.com',
        phone: '(11) 93333-3333',
        status: 'busy',
        currentProject: 'Integração API',
        hourlyRate: '170,00',
        monthlySalary: '14.000,00',
        totalCost: '17.500,00',
        allocationRate: '100%',
        admissionDate: '2023-07-01',
        contractType: 'PJ',
        cpf: '789.012.345-66',
        rg: '78.901.234-5',
        cep: '01310-100',
        street: 'Avenida Paulista',
        number: '3000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP'
      }
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  
  return JSON.parse(stored)
}

export const saveCollaborator = (collaborator: Omit<Collaborator, 'id'>): Collaborator => {
  const collaborators = getCollaborators()
  const newCollaborator: Collaborator = {
    ...collaborator,
    id: Date.now().toString()
  }
  collaborators.push(newCollaborator)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collaborators))
  return newCollaborator
}

export const updateCollaborator = (id: string, updates: Partial<Collaborator>): Collaborator | null => {
  const collaborators = getCollaborators()
  const index = collaborators.findIndex(c => c.id === id)
  if (index === -1) return null
  
  const previous = collaborators[index]
  
  // Se o salário mudou, adiciona ao histórico
  if (updates.hourlyRate && updates.hourlyRate !== previous.hourlyRate) {
    const salaryHistory = previous.salaryHistory || []
    salaryHistory.push({
      date: new Date().toISOString(),
      previousValue: previous.hourlyRate || '',
      newValue: updates.hourlyRate,
    })
    updates.salaryHistory = salaryHistory
  }
  
  collaborators[index] = { ...collaborators[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collaborators))
  return collaborators[index]
}

export const deleteCollaborator = (id: string): boolean => {
  const collaborators = getCollaborators()
  const filtered = collaborators.filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return filtered.length < collaborators.length
}

export const canDeleteCollaborator = (id: string): { canDelete: boolean; activeProjects: string[] } => {
  try {
    // Importação dinâmica para evitar dependência circular
    const { getActiveProjectsByCollaborator } = require('./project-storage')
    const activeProjects = getActiveProjectsByCollaborator(id)
    
    return {
      canDelete: activeProjects.length === 0,
      activeProjects: activeProjects.map(p => p.projectName)
    }
  } catch (error) {
    // Se project-storage não existir ainda, permite deletar
    return {
      canDelete: true,
      activeProjects: []
    }
  }
}

export const addProjectToCollaboratorHistory = (
  collaboratorId: string,
  projectId: string,
  projectName: string,
  startDate: string,
  endDate: string | undefined,
  hourlyRate: string
): void => {
  const collaborators = getCollaborators()
  const index = collaborators.findIndex(c => c.id === collaboratorId)
  if (index === -1) return
  
  const collaborator = collaborators[index]
  const projectHistory = collaborator.projectHistory || []
  
  // Verifica se o projeto já está no histórico
  const existingIndex = projectHistory.findIndex(p => p.projectId === projectId)
  
  if (existingIndex >= 0) {
    // Atualiza projeto existente
    projectHistory[existingIndex] = {
      projectId,
      projectName,
      startDate,
      endDate,
      hourlyRate,
      hoursWorked: projectHistory[existingIndex].hoursWorked
    }
  } else {
    // Adiciona novo projeto ao histórico
    projectHistory.push({
      projectId,
      projectName,
      startDate,
      endDate,
      hourlyRate
    })
  }
  
  collaborators[index] = {
    ...collaborator,
    projectHistory
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collaborators))
}

