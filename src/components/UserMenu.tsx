import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, User, LogOut } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

function UserMenu() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full border border-border hover:bg-muted"
          style={{ color: '#28314d' }}
        >
          <User className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          {user && (
            <div className="px-2 py-1.5 text-sm border-b mb-1">
              <p className="font-medium" style={{ color: '#28314d' }}>{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false)
              navigate('/account')
            }}
          >
            <User className="h-4 w-4" />
            Minha Conta
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false)
              // Navegar para configurações quando implementar
            }}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <div className="border-t my-1" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserMenu

