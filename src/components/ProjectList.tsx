import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProjectDetailsModal from './ProjectDetailsModal'
import { getProjectById, type Project as ProjectType } from '@/utils/project-storage'
import { getCollaborators } from '@/utils/storage'
import { Users, TrendingUp, TrendingDown } from 'lucide-react'

interface Project {
  id: string
  name: string
  value: number
  endDate: string
  status: 'active' | 'completed' | 'onhold'
}

interface ProjectListProps {
  projects: Project[]
}

interface ProjectCalculation {
  revenue: number
  collaboratorCosts: number
  expenses: number
  taxes: number
  netProfit: number
  collaborators: Array<{ name: string; role: string }>
}

function ProjectList({ projects }: ProjectListProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeProjects = projects.filter(p => p.status === 'active')
  const onHoldProjects = projects.filter(p => p.status === 'onhold')
  const completedProjects = projects.filter(p => p.status === 'completed')

  // Busca dados completos e calcula custos/lucro
  const projectCalculations = useMemo(() => {
    const calculations: Record<string, ProjectCalculation> = {}
    const allCollaborators = getCollaborators()

    projects.forEach(project => {
      try {
        const fullProject = getProjectById(project.id)
        if (!fullProject) return

      // Receita (valor do projeto)
      const revenue = parseFloat(fullProject.value.replace(/\./g, '').replace(',', '.')) || 0

      // Custo dos colaboradores (estimativa baseada em horas trabalhadas ou custo fixo)
      // Por enquanto, vamos usar uma estimativa simples baseada no custo/hora
      let collaboratorCosts = 0
      const projectCollaborators: Array<{ name: string; role: string }> = []
      
      fullProject.collaborators.forEach(collabId => {
        const collaborator = allCollaborators.find(c => c.id === collabId)
        if (collaborator) {
          projectCollaborators.push({
            name: collaborator.name,
            role: collaborator.role
          })
          
          // Estima custo baseado em horas trabalhadas do histórico ou usa um valor padrão
          const customCost = fullProject.collaboratorCosts?.[collabId]
          const hourlyRate = parseFloat((customCost || collaborator.hourlyRate || '0').replace(/\./g, '').replace(',', '.')) || 0
          
          // Estima 160 horas por mês (8h/dia * 20 dias) para projetos ativos
          // Para projetos finalizados, poderia usar horas trabalhadas do histórico
          const startDate = new Date(fullProject.startDate)
          const endDate = new Date(fullProject.endDate)
          const months = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
          const estimatedHours = months * 160
          
          collaboratorCosts += hourlyRate * estimatedHours
        }
      })

      // Despesas
      const expenses = fullProject.expenses.reduce((sum, exp) => {
        const value = parseFloat(exp.value.replace(/\./g, '').replace(',', '.')) || 0
        return sum + value
      }, 0)

      // Impostos (calcula sobre a receita)
      const taxes = fullProject.taxes
        .filter(tax => tax.selected)
        .reduce((sum, tax) => {
          const percentage = parseFloat(tax.percentage.replace(',', '.')) || 0
          return sum + (revenue * percentage / 100)
        }, 0)

      // Lucro líquido
      const netProfit = revenue - collaboratorCosts - expenses - taxes

        calculations[project.id] = {
          revenue,
          collaboratorCosts,
          expenses,
          taxes,
          netProfit,
          collaborators: projectCollaborators
        }
      } catch (error) {
        console.error(`Erro ao calcular projeto ${project.id}:`, error)
      }
    })

    return calculations
  }, [projects.map(p => p.id).join(',')])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const formatCurrency = (value: number, compact: boolean = true) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#51ad78'
      case 'onhold':
        return '#f59e0b'
      case 'completed':
        return '#6b7280'
      default:
        return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativos'
      case 'onhold':
        return 'Em Pausa'
      case 'completed':
        return 'Finalizados'
      default:
        return status
    }
  }

  const renderProjectSection = (title: string, projectList: Project[], status: string) => {
    if (projectList.length === 0) return null

    return (
      <div className="mb-5 sm:mb-7 last:mb-0">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: getStatusColor(status) }}
          />
          <h3 className="text-sm sm:text-base font-semibold" style={{ color: '#28314d' }}>
            {title} ({projectList.length})
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {projectList.map((project) => {
            const calc = projectCalculations[project.id]
            const hasProfit = calc && calc.netProfit > 0
            const hasLoss = calc && calc.netProfit < 0

            return (
              <div
                key={project.id}
                className="p-4 rounded-lg border hover:shadow-lg transition-all cursor-pointer bg-white"
                style={{
                  borderColor: hasProfit ? '#51ad7840' : hasLoss ? '#ef444440' : '#e5e7eb',
                  borderWidth: hasProfit || hasLoss ? '2px' : '1px'
                }}
                onClick={() => {
                  setSelectedProjectId(project.id)
                  setIsModalOpen(true)
                }}
              >
                {/* Header com nome e status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5 break-words" style={{ color: '#28314d' }}>
                      {project.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Finaliza: {formatDate(project.endDate)}</span>
                    </div>
                  </div>
                  <Badge
                    variant={"outline" as const}
                    className="text-xs flex-shrink-0"
                    style={{
                      backgroundColor: getStatusColor(status) + '20',
                      color: getStatusColor(status),
                      borderColor: getStatusColor(status)
                    }}
                  >
                    {getStatusLabel(status)}
                  </Badge>
                </div>

                {/* Profissionais */}
                {calc && calc.collaborators.length > 0 && (
                  <div className="mb-3 pb-3 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Profissionais ({calc.collaborators.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {calc.collaborators.slice(0, 3).map((collab, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {collab.name}
                        </span>
                      ))}
                      {calc.collaborators.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          +{calc.collaborators.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Resumo Financeiro */}
                {calc && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-0.5">Receita</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(calc.revenue, true)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5">Custos</p>
                        <p className="font-semibold text-red-600">
                          {formatCurrency(calc.collaboratorCosts + calc.expenses + calc.taxes, true)}
                        </p>
                      </div>
                    </div>

                    {/* Lucro Líquido - DESTAQUE */}
                    <div
                      className="mt-3 pt-3 border-t rounded-lg p-2.5"
                      style={{
                        backgroundColor: hasProfit ? '#51ad7810' : hasLoss ? '#ef444410' : '#f3f4f6',
                        borderColor: hasProfit ? '#51ad7840' : hasLoss ? '#ef444440' : '#e5e7eb'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {hasProfit ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : hasLoss ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : null}
                          <span className="text-xs font-medium text-muted-foreground">
                            Lucro Líquido
                          </span>
                        </div>
                        <p
                          className="font-bold text-base"
                          style={{
                            color: hasProfit ? '#51ad78' : hasLoss ? '#ef4444' : '#28314d'
                          }}
                        >
                          {formatCurrency(calc.netProfit, false)}
                        </p>
                      </div>
                      {calc.revenue > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          {((calc.netProfit / calc.revenue) * 100).toFixed(1)}% de margem
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg" style={{ color: '#28314d' }}>Listagem de Projetos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-5">
          {renderProjectSection('Projetos Ativos', activeProjects, 'active')}
          {renderProjectSection('Projetos em Pausa', onHoldProjects, 'onhold')}
          {renderProjectSection('Projetos Finalizados', completedProjects, 'completed')}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 sm:py-10 text-muted-foreground text-sm">
            Nenhum projeto cadastrado
          </div>
        )}
      </CardContent>

      <ProjectDetailsModal
        projectId={selectedProjectId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Card>
  )
}

export default ProjectList

