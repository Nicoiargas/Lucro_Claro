import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Professional {
  id: string
  name: string
  role: string
  status: 'busy' | 'available'
  currentProject?: string
}

interface TeamStatusProps {
  professionals: Professional[]
}

function TeamStatus({ professionals }: TeamStatusProps) {
  const getStatusColor = (status: string) => {
    return status === 'busy' ? '#ef4444' : '#51ad78'
  }

  const getStatusText = (status: string) => {
    return status === 'busy' ? 'Ocupado' : 'Disponível'
  }

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg" style={{ color: '#28314d' }}>Status da Equipe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getStatusColor(professional.status) }}
                />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#28314d' }}>
                    {professional.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {professional.role}
                  </p>
                  {professional.currentProject && (
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      {professional.currentProject}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={"outline" as const}
                  className="text-xs"
                  style={{
                    backgroundColor: getStatusColor(professional.status) + '20',
                    color: getStatusColor(professional.status),
                    borderColor: getStatusColor(professional.status)
                  }}
                >
                  {getStatusText(professional.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Total de profissionais
            </span>
            <span className="font-semibold" style={{ color: '#28314d' }}>
              {professionals.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1.5">
            <span className="text-muted-foreground">
              Disponíveis
            </span>
            <span className="font-semibold" style={{ color: '#51ad78' }}>
              {professionals.filter(p => p.status === 'available').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1.5">
            <span className="text-muted-foreground">
              Ocupados
            </span>
            <span className="font-semibold" style={{ color: '#ef4444' }}>
              {professionals.filter(p => p.status === 'busy').length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamStatus

