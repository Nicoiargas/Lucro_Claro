import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

function ProjectList({ projects }: ProjectListProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const onHoldProjects = projects.filter(p => p.status === 'onhold')
  const completedProjects = projects.filter(p => p.status === 'completed')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
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
        <div className="space-y-2 sm:space-y-2.5">
          {projectList.map((project) => (
            <div
              key={project.id}
              className="p-3 rounded-lg border hover:shadow-md transition-all"
              style={{
                borderColor: '#e5e7eb',
                backgroundColor: '#ffffff'
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-sm mb-1.5 break-words" style={{ color: '#28314d' }}>
                    {project.name}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                    <span>Finaliza: {formatDate(project.endDate)}</span>
                    <span className="font-semibold" style={{ color: '#28314d' }}>
                      {formatCurrency(project.value)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={"outline" as const}
                  className="text-xs w-fit sm:w-auto"
                  style={{
                    backgroundColor: getStatusColor(status) + '20',
                    color: getStatusColor(status),
                    borderColor: getStatusColor(status)
                  }}
                >
                  {getStatusLabel(status)}
                </Badge>
              </div>
            </div>
          ))}
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
    </Card>
  )
}

export default ProjectList

