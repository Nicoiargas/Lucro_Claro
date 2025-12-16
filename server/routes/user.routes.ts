import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { getUser, updateUser, changePassword } from '../controllers/user.controller.js'

const router = express.Router()

// Todas as rotas de usuário requerem autenticação
router.use(authenticateToken)

router.get('/me', getUser)
router.put('/me', updateUser)
router.put('/me/password', changePassword)

export default router

