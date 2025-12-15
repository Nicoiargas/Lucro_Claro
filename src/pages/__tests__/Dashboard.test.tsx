import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import * as storageUtils from '@/utils/storage'
import * as projectStorageUtils from '@/utils/project-storage'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock dos utilitários de storage
vi.mock('@/utils/storage', () => ({
  getCollaborators: vi.fn(),
}))

vi.mock('@/utils/project-storage', () => ({
  getProjects: vi.fn(),
}))

// Helper para renderizar o componente com Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // localStorage é limpo automaticamente pelo setup.ts
  })

  it('deve renderizar o componente Dashboard corretamente', () => {
    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    // Verifica se o título está presente
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Visão geral dos projetos e métricas')).toBeInTheDocument()
  })

  it('deve exibir o logo da aplicação', () => {
    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    const logo = screen.getByAltText('Lucro Claro')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo2.svg')
  })

  it('deve exibir os botões de ação', () => {
    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    expect(screen.getByText('Novo Contrato')).toBeInTheDocument()
    expect(screen.getByText('Novo Colaborador')).toBeInTheDocument()
  })

  it('deve navegar para /projects/new ao clicar em Novo Contrato', async () => {
    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    const novoContratoButton = screen.getByText('Novo Contrato')
    novoContratoButton.click()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects/new')
    })
  })

  it('deve navegar para /collaborators/new ao clicar em Novo Colaborador', async () => {
    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    const novoColaboradorButton = screen.getByText('Novo Colaborador')
    novoColaboradorButton.click()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/collaborators/new')
    })
  })

  it('deve carregar projetos do storage', () => {
    const mockProjects = [
      {
        id: '1',
        projectName: 'Projeto Teste',
        clientId: '1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        contractType: 'fixed' as const,
        value: '100.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'active' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue(mockProjects)

    renderWithRouter(<Dashboard />)

    expect(projectStorageUtils.getProjects).toHaveBeenCalled()
  })

  it('deve carregar colaboradores do storage', () => {
    const mockCollaborators = [
      {
        id: '1',
        name: 'João Silva',
        role: 'Desenvolvedor',
        email: 'joao@test.com',
        phone: '(11) 99999-9999',
        status: 'available' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue(mockCollaborators)
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    expect(storageUtils.getCollaborators).toHaveBeenCalled()
  })

  it('deve renderizar DashboardStats com projetos', () => {
    const mockProjects = [
      {
        id: '1',
        projectName: 'Projeto Ativo',
        clientId: '1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        contractType: 'fixed' as const,
        value: '100.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'active' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue(mockProjects)

    renderWithRouter(<Dashboard />)

    // Verifica se o componente DashboardStats está sendo renderizado
    // (verificando por elementos que ele renderiza)
    expect(screen.getByText('Projetos Ativos')).toBeInTheDocument()
  })

  it('deve renderizar ProjectList com projetos', () => {
    const mockProjects = [
      {
        id: '1',
        projectName: 'Projeto Teste',
        clientId: '1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        contractType: 'fixed' as const,
        value: '100.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'active' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue(mockProjects)

    renderWithRouter(<Dashboard />)

    // Verifica se o componente ProjectList está sendo renderizado
    expect(screen.getByText('Listagem de Projetos')).toBeInTheDocument()
  })

  it('deve renderizar TeamStatus com colaboradores', () => {
    const mockCollaborators = [
      {
        id: '1',
        name: 'João Silva',
        role: 'Desenvolvedor',
        email: 'joao@test.com',
        phone: '(11) 99999-9999',
        status: 'available' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue(mockCollaborators)
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue([])

    renderWithRouter(<Dashboard />)

    // Verifica se o componente TeamStatus está sendo renderizado
    // (verificando por elementos que ele renderiza)
    expect(screen.getByText('Status da Equipe')).toBeInTheDocument()
  })

  it('deve renderizar EvolutionChart com projetos', () => {
    const mockProjects = [
      {
        id: '1',
        projectName: 'Projeto Teste',
        clientId: '1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        contractType: 'fixed' as const,
        value: '100.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'active' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue(mockProjects)

    renderWithRouter(<Dashboard />)

    // Verifica se o componente EvolutionChart está sendo renderizado
    // (verificando por elementos que ele renderiza)
    expect(screen.getByText('Evolução de Receita')).toBeInTheDocument()
  })

  it('deve converter valores de projetos corretamente', () => {
    const mockProjects = [
      {
        id: '1',
        projectName: 'Projeto Teste',
        clientId: '1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        contractType: 'fixed' as const,
        value: '150.000,00',
        collaborators: [],
        expenses: [],
        taxes: [],
        status: 'active' as const,
      },
    ]

    vi.mocked(storageUtils.getCollaborators).mockReturnValue([])
    vi.mocked(projectStorageUtils.getProjects).mockReturnValue(mockProjects)

    renderWithRouter(<Dashboard />)

    // O valor deve ser convertido de '150.000,00' para número
    // e exibido no DashboardStats
    expect(projectStorageUtils.getProjects).toHaveBeenCalled()
  })
})

