import { Card, CardContent } from '@/components/ui/card'
import { ClipboardList, DollarSign, BarChart3, TrendingUp } from 'lucide-react'

interface Project {
  id: string
  name: string
  value: number
  endDate: string
  status: 'active' | 'completed' | 'onhold'
}

interface DashboardStatsProps {
  projects: Project[]
}

function DashboardStats({ projects }: DashboardStatsProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const totalActiveValue = activeProjects.reduce((sum, p) => sum + p.value, 0)
  const averageValue = activeProjects.length > 0 
    ? totalActiveValue / activeProjects.length 
    : 0

  // Valor total futuro (considerando todos os projetos ativos)
  const totalFutureValue = totalActiveValue

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const stats = [
    {
      title: 'Projetos Ativos',
      value: activeProjects.length,
      icon: ClipboardList,
      color: '#51ad78'
    },
    {
      title: 'Valor Médio dos Projetos',
      value: formatCurrency(averageValue),
      icon: DollarSign,
      color: '#28314d'
    },
    {
      title: 'Valor Total dos Projetos Ativos',
      value: formatCurrency(totalActiveValue),
      icon: BarChart3,
      color: '#28314d'
    },
    {
      title: 'Valor Total Futuro',
      value: formatCurrency(totalFutureValue),
      icon: TrendingUp,
      color: '#28314d'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="shadow-lg border-t-4"
            style={{ borderTopColor: stat.color }}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5 truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl font-bold break-words" style={{ color: '#28314d' }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{ color: stat.color }} className="flex-shrink-0 ml-2">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default DashboardStats

