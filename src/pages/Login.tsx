import LoginForm from '../components/LoginForm'
import { Card, CardContent } from '@/components/ui/card'

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md shadow-lg border-t-4" style={{ borderTopColor: '#51ad78' }}>
        <CardContent className="px-8 py-8">
          <div className="flex justify-center mb-8">
            <img 
              src="/logo2.svg" 
              alt="Lucro Claro" 
              style={{ height: '135px', width: 'auto' }}
            />
          </div>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

