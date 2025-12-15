import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

// Mock de métodos do DOM para compatibilidade com Radix UI e jsdom
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || function() {
    return false
  }
  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || function() {}
  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || function() {}
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function() {}
}

// Limpa o estado após cada teste
afterEach(() => {
  cleanup()
  // Limpa o localStorage entre os testes
  localStorageMock.clear()
})

