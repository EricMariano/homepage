"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Verificar se token ainda é válido
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Token inválido, remover
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return { user, loading, logout }
}