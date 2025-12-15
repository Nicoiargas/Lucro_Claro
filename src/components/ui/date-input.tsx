import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value?: string
  onChange?: (value: string) => void
  min?: string
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value = '', onChange, placeholder, min, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const dateInputRef = React.useRef<HTMLInputElement>(null)

    // Converte YYYY-MM-DD para DD/MM/YYYY para exibição
    const formatDisplayDate = (dateStr: string): string => {
      if (!dateStr) return ''
      if (dateStr.includes('/')) return dateStr // Já está formatado
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-')
        if (year && month && day) {
          return `${day}/${month}/${year}`
        }
      }
      return dateStr
    }

    // Converte DD/MM/YYYY para YYYY-MM-DD
    const formatISO = (dateStr: string): string => {
      if (!dateStr) return ''
      if (dateStr.includes('-')) return dateStr // Já está em ISO
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/')
        if (parts.length === 3) {
          const [day, month, year] = parts
          if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          }
        }
      }
      return dateStr
    }

    const formatDate = (val: string): string => {
      // Remove tudo que não é dígito
      const numbers = val.replace(/\D/g, '')
      
      if (!numbers) return ''
      
      // Limita a 8 dígitos (DDMMYYYY)
      const limited = numbers.slice(0, 8)
      
      // Aplica máscara: DD/MM/YYYY
      if (limited.length <= 2) {
        return limited
      } else if (limited.length <= 4) {
        return `${limited.slice(0, 2)}/${limited.slice(2)}`
      } else {
        return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`
      }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatDate(e.target.value)
      // Atualiza o input de data também
      if (formatted.length === 10) {
        const isoDate = formatISO(formatted)
        if (isoDate && dateInputRef.current) {
          dateInputRef.current.value = isoDate
        }
        if (onChange) {
          onChange(isoDate)
        }
      } else if (onChange) {
        onChange(formatted)
      }
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

    const handleInputClick = () => {
      // Quando clica no input, abre o datepicker
      if (dateInputRef.current) {
        dateInputRef.current.showPicker?.()
      }
    }

    const displayValue = formatDisplayDate(value)
    const isoValue = value && value.includes('/') ? formatISO(value) : (value || '')

    return (
      <div className="relative">
        {/* Input de texto para digitação */}
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleTextChange}
          onClick={handleInputClick}
          placeholder={placeholder || "DD/MM/AAAA"}
          maxLength={10}
          className={cn("pr-10 cursor-pointer", className)}
          {...props}
        />
        {/* Input de data nativo (escondido) para datepicker */}
        <input
          ref={dateInputRef}
          type="date"
          value={isoValue}
          onChange={handleDateChange}
          min={min}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          style={{ width: '100%', height: '100%' }}
        />
        <Calendar 
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-0" 
        />
      </div>
    )
  }
)
DateInput.displayName = "DateInput"

export { DateInput }

