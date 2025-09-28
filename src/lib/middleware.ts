import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function withAuth(handler: (request: NextRequest, ...args: unknown[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Criar request customizado com userId
    const customRequest = {
      ...request,
      userId: decoded.userId
    } as NextRequest & { userId: string }
    
    return handler(customRequest, ...args)
  }
}