import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EvolutionChartProps {
  projects: any[]
}

function EvolutionChart({}: EvolutionChartProps) {
  // Dados mockados para evolução mensal
  const monthlyData = [
    { month: 'Jan', value: 120000 },
    { month: 'Fev', value: 180000 },
    { month: 'Mar', value: 250000 },
    { month: 'Abr', value: 320000 },
    { month: 'Mai', value: 400000 },
    { month: 'Jun', value: 660000 }
  ]

  const maxValue = Math.max(...monthlyData.map(d => d.value))
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg" style={{ color: '#28314d' }}>Evolução de Receita</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3.5">
          {monthlyData.map((data, index) => {
            const percentage = (data.value / maxValue) * 100
            
            return (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium" style={{ color: '#28314d' }}>
                    {data.month}
                  </span>
                  <span className="font-semibold" style={{ color: '#28314d' }}>
                    {formatCurrency(data.value)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: '#51ad78'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default EvolutionChart

