import { prisma } from '../prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body
  try {
    const user = await prisma.user.create({
      data: { email, password: await bcrypt.hash(password, 10), firstName, lastName }
    })
    res.status(201).json({ id: user.id, email: user.email })
  } catch {
    res.status(400).json({ error: 'Email exists' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET)
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } })
}

export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profileAttrs: { include: { attribute: true } } }
  })
  res.json(user)
}

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  })
  res.json(users)
}

export const updateRole = async (req, res) => {
  const { role } = req.body
  if (!['candidate', 'recruiter', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }
  const user = await prisma.user.update({
    where: { id: +req.params.id },
    data: { role }
  })
  res.json({ id: user.id, email: user.email, role: user.role })
}

export const deleteUser = async (req, res) => {
  await prisma.user.delete({ where: { id: +req.params.id } })
  res.status(204).send()
}