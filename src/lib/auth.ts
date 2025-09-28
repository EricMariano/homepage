import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET é obrigatório! Defina a variável de ambiente JWT_SECRET.')
}

if (process.env.NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  console.warn('⚠️  JWT_SECRET muito curto para produção! Use pelo menos 32 caracteres.')
}

// Garantir que JWT_SECRET não seja undefined para TypeScript
const SECRET_KEY = JWT_SECRET as string

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string }
  } catch {
    return null
  }
}