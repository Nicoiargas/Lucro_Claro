import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SplashScreen() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation com pequeno delay para suavizar
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 50)
    
    // Mostra a splash screen por 2 segundos antes de redirecionar
    const redirectTimer = setTimeout(() => {
      // Fade out antes de redirecionar
      setIsVisible(false)
      setTimeout(() => {
        navigate('/dashboard')
      }, 400) // Aguarda o fade out completar
    }, 2000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(redirectTimer)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern Sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(40, 49, 77, 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className={`flex flex-col items-center justify-center space-y-8 px-4 z-10 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Logo com animação */}
        <div className={`transform transition-all duration-500 ease-out delay-100 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <img 
            src="/logo2.svg" 
            alt="Lucro Claro" 
            className="h-28 sm:h-36 md:h-40 w-auto"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(40, 49, 77, 0.15))' }}
          />
        </div>

        {/* Frase de Impacto */}
        <div className={`text-center space-y-3 sm:space-y-4 transform transition-all duration-500 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: '#28314d' }}>
            Transformando Projetos em
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#51ad78] leading-tight">
            Lucro Real
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-6 max-w-lg mx-auto font-light">
            Gestão inteligente de projetos e equipes
          </p>
        </div>

        {/* Loading Indicator */}
        <div className={`mt-8 transform transition-all duration-500 ease-out delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative">
            <div className="w-10 h-10 border-3 border-muted border-t-[#51ad78] rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <style>{`
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  )
}

export default SplashScreen

