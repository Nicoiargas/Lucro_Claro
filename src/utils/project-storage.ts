// Utilitário para gerenciar projetos no localStorage
// Isso será substituído por uma API real no futuro

export interface Project {
  id: string
  projectName: string
  clientId: string
  startDate: string
  endDate: string
  contractType: 'fixed' | 'monthly'
  value: string
  collaborators: string[] // IDs dos colaboradores
  collaboratorCosts?: Record<string, string> // collaboratorId -> custom hourly rate
  expenses: Array<{
    id: string
    name: string
    value: string
  }>
  taxes: Array<{
    id: string
    name: string
    percentage: string
    selected: boolean
  }>
  status: 'active' | 'completed' | 'onhold'
}

const STORAGE_KEY = 'lucroclaro_projects'

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Dados iniciais mockados
    const initial: Project[] = [
      {
        id: '1',
        projectName: 'Sistema de Gestão ERP',
        clientId: '1',
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        contractType: 'fixed',
        value: '150.000,00',
        collaborators: ['1'],
        expenses: [],
        taxes: [],
        status: 'active'
      },
      {
        id: '2',
        projectName: 'Plataforma E-commerce',
        clientId: '2',
        startDate: '2024-02-01',
        endDate: '2024-03-28',
        contractType: 'fixed',
        value: '85.000,00',
        collaborators: ['2'],
        expenses: [],
        taxes: [],
        status: 'active'
      },
      {
        id: '3',
        projectName: 'App Mobile iOS/Android',
        clientId: '3',
        startDate: '2024-02-15',
        endDate: '2024-04-10',
        contractType: 'fixed',
        value: '120.000,00',
        collaborators: ['3'],
        expenses: [],
        taxes: [],
        status: 'active'
      },
      {
        id: '4',
        projectName: 'Website Institucional',
        clientId: '4',
        startDate: '2024-03-01',
        endDate: '2024-04-22',
        contractType: 'fixed',
        value: '45.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'active'
      },
      {
        id: '5',
        projectName: 'Sistema de BI',
        clientId: '1',
        startDate: '2024-03-10',
        endDate: '2024-05-05',
        contractType: 'fixed',
        value: '200.000,00',
        collaborators: ['5'],
        expenses: [],
        taxes: [],
        status: 'active'
      },
      {
        id: '6',
        projectName: 'Integração API',
        clientId: '2',
        startDate: '2024-01-20',
        endDate: '2024-05-18',
        contractType: 'fixed',
        value: '60.000,00',
        collaborators: ['7'],
        expenses: [],
        taxes: [],
        status: 'onhold'
      },
      {
        id: '7',
        projectName: 'Portal do Cliente',
        clientId: '3',
        startDate: '2023-12-01',
        endDate: '2024-02-20',
        contractType: 'fixed',
        value: '95.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'onhold'
      },
      {
        id: '8',
        projectName: 'Dashboard Analytics',
        clientId: '4',
        startDate: '2023-11-01',
        endDate: '2024-01-15',
        contractType: 'fixed',
        value: '75.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'completed'
      },
      {
        id: '9',
        projectName: 'Sistema de Pagamentos',
        clientId: '1',
        startDate: '2023-10-01',
        endDate: '2024-01-30',
        contractType: 'fixed',
        value: '130.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'completed'
      },
      {
        id: '10',
        projectName: 'API de Integração',
        clientId: '2',
        startDate: '2023-09-01',
        endDate: '2023-12-10',
        contractType: 'fixed',
        value: '55.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'completed'
      }
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  
  return JSON.parse(stored)
}

export const saveProject = (project: Omit<Project, 'id'>): Project => {
  const projects = getProjects()
  const newProject: Project = {
    ...project,
    id: Date.now().toString()
  }
  projects.push(newProject)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  return newProject
}

export const updateProject = (id: string, updates: Partial<Project>): Project | null => {
  const projects = getProjects()
  const index = projects.findIndex(p => p.id === id)
  if (index === -1) return null
  
  projects[index] = { ...projects[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  return projects[index]
}

export const deleteProject = (id: string): boolean => {
  const projects = getProjects()
  const filtered = projects.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return filtered.length < projects.length
}

export const getProjectById = (id: string): Project | null => {
  const projects = getProjects()
  return projects.find(p => p.id === id) || null
}

export const getActiveProjectsByCollaborator = (collaboratorId: string): Project[] => {
  const projects = getProjects()
  return projects.filter(
    p => p.status === 'active' && p.collaborators.includes(collaboratorId)
  )
}

export const getAllProjectsByCollaborator = (collaboratorId: string): Project[] => {
  const projects = getProjects()
  return projects.filter(p => p.collaborators.includes(collaboratorId))
}

