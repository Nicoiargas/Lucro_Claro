import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardStats from '../components/DashboardStats'
import ProjectList from '../components/ProjectList'
import EvolutionChart from '../components/EvolutionChart'
import TeamStatus from '../components/TeamStatus'
import Breadcrumbs from '../components/Breadcrumbs'
import UserMenu from '../components/UserMenu'
import { Button } from '@/components/ui/button'
import { FileText, UserPlus } from 'lucide-react'
import { getCollaborators, type Collaborator } from '@/utils/storage'
import { getProjects, type Project as ProjectType } from '@/utils/project-storage'

interface Project {
  id: string
  name: string
  value: number
  endDate: string
  status: 'active' | 'completed' | 'onhold'
}

interface Professional {
  id: string
  name: string
  role: string
  status: 'busy' | 'available'
  currentProject?: string
}

function Dashboard() {
  const navigate = useNavigate()
  
  const handleNewContract = () => {
    navigate('/projects/new')
  }

  const handleNewCollaborator = () => {
    navigate('/collaborators/new')
  }

  const [projects, setProjects] = useState<Project[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  useEffect(() => {
    // Carrega projetos do storage e converte para o formato esperado
    const loadProjects = () => {
      const storedProjects = getProjects()
      const formatted: Project[] = storedProjects.map(p => {
        // Converte valor de string formatada para número
        const numericValue = parseFloat(p.value.replace(/\./g, '').replace(',', '.')) || 0
        return {
          id: p.id,
          name: p.projectName,
          value: numericValue,
          endDate: p.endDate,
          status: p.status
        }
      })
      setProjects(formatted)
    }

    // Carrega colaboradores do storage e converte para o formato esperado
    const loadProfessionals = () => {
      const collaborators = getCollaborators()
      const formatted: Professional[] = collaborators.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role,
        status: c.status,
        currentProject: c.currentProject
      }))
      // Ordena para que profissionais disponíveis apareçam primeiro
      const sorted = formatted.sort((a, b) => {
        if (a.status === 'available' && b.status === 'busy') return -1
        if (a.status === 'busy' && b.status === 'available') return 1
        return 0
      })
      setProfessionals(sorted)
    }
    
    loadProjects()
    loadProfessionals()
    
    // Recarrega quando a janela recebe foco (quando volta da página de cadastro)
    const handleFocus = () => {
      loadProjects()
      loadProfessionals()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <div className="bg-muted/50 py-4 sm:py-6 pb-6 sm:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
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
        
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#28314d' }}>
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Visão geral dos projetos e métricas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={handleNewContract}
                className="flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                style={{ backgroundColor: '#28314d', borderColor: '#28314d' }}
              >
                <FileText className="h-4 w-4" />
                Novo Contrato
              </Button>
              <Button
                onClick={handleNewCollaborator}
                variant="outline"
                className="flex items-center justify-center gap-2 text-sm border-primary/20 w-full sm:w-auto"
                style={{ color: '#28314d' }}
              >
                <UserPlus className="h-4 w-4" />
                Novo Colaborador
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Grid 12 colunas */}
        <div className="mb-6 sm:mb-8">
          <DashboardStats projects={projects} />
        </div>

        {/* Conteúdo Principal - Grid 12 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* Coluna Esquerda - 5 colunas */}
          <div className="md:col-span-12 lg:col-span-5 space-y-4 sm:space-y-5">
            <TeamStatus professionals={professionals} />
            <EvolutionChart projects={projects} />
          </div>

          {/* Coluna Direita - 7 colunas */}
          <div className="md:col-span-12 lg:col-span-7">
            <ProjectList projects={projects} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

