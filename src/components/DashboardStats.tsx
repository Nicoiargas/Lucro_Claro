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
    <div className="grid grid-cols-12 gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Card
              className="shadow-lg border-t-4 h-full"
              style={{ borderTopColor: stat.color }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{stat.title}</p>
                    <p className="text-xl font-bold" style={{ color: '#28314d' }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={{ color: stat.color }}>
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardStats

