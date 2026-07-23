import { prisma } from '../prisma.js'

const buildWhere = (category, search) => {
  const where = {}
  if (category) where.category = category
  if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }]
  return where
}

export const getAll = async (req, res) => {
  const { category, search } = req.query
  res.json(await prisma.attribute.findMany({
    where: buildWhere(category, search),
    orderBy: { name: 'asc' }
  }))
}

export const getCategories = async (req, res) => {
  const categories = await prisma.attribute.findMany({
    select: { category: true },
    distinct: ['category']
  })
  res.json(categories.map(c => c.category))
}

export const create = async (req, res) => {
  try {
    res.status(201).json(await prisma.attribute.create({ data: req.body }))
  } catch {
    res.status(400).json({ error: 'Name exists' })
  }
}

export const update = async (req, res) => {
  try {
    res.json(await prisma.attribute.update({ where: { id: +req.params.id }, data: req.body }))
  } catch {
    res.status(400).json({ error: 'Update failed' })
  }
}

export const remove = async (req, res) => {
  await prisma.attribute.delete({ where: { id: +req.params.id } })
  res.status(204).send()
}