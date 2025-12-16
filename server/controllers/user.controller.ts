import { Request, Response } from 'express'
import prisma from '../lib/prisma.js'
import bcrypt from 'bcryptjs'

export async function getUser(req: Request, res: Response) {
  try {
    const userId = (req as any).userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        company: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { name, email, phone, company } = req.body

    // Validações
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' })
    }

    // Verificar se email já está em uso por outro usuário
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Este email já está em uso' })
      }
    }

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(company !== undefined && { company: company?.trim() || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        company: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Verificar senha atual
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Senha atual incorreta' })
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    res.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    res.status(500).json({ error: 'Erro ao alterar senha' })
  }
}

