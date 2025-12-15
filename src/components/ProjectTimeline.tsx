interface Project {
  id: string
  name: string
  value: number
  endDate: string
  status: 'active' | 'completed' | 'pending'
}

interface ProjectTimelineProps {
  projects: Project[]
}

function ProjectTimeline({ projects }: ProjectTimelineProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  
  // Ordenar por data de término
  const sortedProjects = [...activeProjects].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getDaysUntilEnd = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="card bg-base-100 shadow-lg h-full">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6" style={{ color: '#28314d' }}>
          Timeline de Projetos
        </h2>
        
        <div className="space-y-3">
          {sortedProjects.map((project) => {
            const daysUntilEnd = getDaysUntilEnd(project.endDate)
            const isUrgent = daysUntilEnd <= 30
            const isWarning = daysUntilEnd <= 60 && daysUntilEnd > 30

            return (
              <div
                key={project.id}
                className="p-3 rounded-lg border-l-2 hover:bg-base-200 transition-colors"
                style={{
                  borderLeftColor: isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : '#51ad78'
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-base mb-1" style={{ color: '#28314d' }}>
                      {project.name}
                    </h3>
                    <p className="text-xs text-base-content/70 mb-2">
                      {formatDate(project.endDate)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : '#51ad78'
                        }}
                      />
                      <p className={`text-xs ${
                        isUrgent ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-base-content/70'
                      }`}>
                        {daysUntilEnd > 0 
                          ? `${daysUntilEnd} ${daysUntilEnd === 1 ? 'dia' : 'dias'}`
                          : 'Finalizado'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm" style={{ color: '#28314d' }}>
                      {formatCurrency(project.value)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {sortedProjects.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            Nenhum projeto ativo no momento
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectTimeline

