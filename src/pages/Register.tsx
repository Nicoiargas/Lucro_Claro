import RegisterForm from '../components/RegisterForm'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-8">
      <Card className="w-full max-w-md shadow-lg border-t-4" style={{ borderTopColor: '#51ad78' }}>
        <CardContent className="px-8 py-8">
          <div className="flex justify-center mb-8">
            <img 
              src="/logo2.svg" 
              alt="Lucro Claro" 
              style={{ height: '135px', width: 'auto' }}
            />
          </div>
          <RegisterForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="font-medium hover:underline"
                style={{ color: '#28314d' }}
              >
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register

