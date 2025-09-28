const bcrypt = require('bcryptjs')
const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function createUser() {
  try {
    const email = 'ericbfmariano@gmail.com'
    const password = 'root123'
    const name = 'Eric Mariano'

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    console.log('✅ Usuário criado com sucesso!')
    console.log('📧 Email:', user.email)
    console.log('👤 Nome:', user.name)
    console.log('🆔 ID:', user.id)
    console.log('')
    console.log('🔐 Credenciais de login:')
    console.log('Email:', email)
    console.log('Senha:', password)
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()