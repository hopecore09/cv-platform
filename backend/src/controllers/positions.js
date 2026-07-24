import { prisma } from '../prisma.js'

const buildWhere = (search) => search ? {
  OR: [{ title: { contains: search } }, { description: { contains: search } }, { company: { contains: search } }]
} : {}

export const getAll = async (req, res) => {
  const { search, sort } = req.query
  const orderBy = sort === 'popular' ? { cvs: { _count: 'desc' } } : { createdAt: 'desc' }
  res.json(await prisma.position.findMany({
    where: buildWhere(search),
    include: { recruiter: { select: { firstName: true, lastName: true } }, _count: { select: { cvs: true } } },
    orderBy
  }))
}

export const getOne = async (req, res) => {
  const position = await prisma.position.findUnique({
    where: { id: +req.params.id },
    include: {
      recruiter: { select: { firstName: true, lastName: true } },
      attrs: { include: { attribute: true }, orderBy: { order: 'asc' } },
      cvs: { where: { isPublished: true }, include: { user: { select: { firstName: true, lastName: true } } } }
    }
  })
  if (!position) return res.status(404).json({ error: 'Not found' })
  res.json(position)
}

export const create = async (req, res) => {
  const { title, description, company, level, attributeIds } = req.body
  const position = await prisma.position.create({
    data: {
      title, description, company, level,
      recruiterId: req.user.id,
      attrs: { create: attributeIds?.map((id, i) => ({ attributeId: id, order: i })) || [] }
    },
    include: { attrs: { include: { attribute: true } } }
  })
  res.status(201).json(position)
}

export const update = async (req, res) => {
  const { attributeIds, ...data } = req.body
  await prisma.positionAttribute.deleteMany({ where: { positionId: +req.params.id } })
  const position = await prisma.position.update({
    where: { id: +req.params.id },
    data: {
      ...data,
      attrs: { create: attributeIds?.map((id, i) => ({ attributeId: id, order: i })) || [] }
    },
    include: { attrs: { include: { attribute: true } } }
  })
  res.json(position)
}

export const remove = async (req, res) => {
  await prisma.position.delete({ where: { id: +req.params.id } })
  res.status(204).send()
}

export const duplicate = async (req, res) => {
  const original = await prisma.position.findUnique({
    where: { id: +req.params.id },
    include: { attrs: true }
  })
  if (!original) return res.status(404).json({ error: 'Not found' })
  const { id, attrs, createdAt, updatedAt, ...data } = original
  const position = await prisma.position.create({
    data: {
      ...data,
      title: `${data.title} (Copy)`,
      recruiterId: req.user.id,
      attrs: { create: attrs.map(a => ({ attributeId: a.attributeId, order: a.order })) }
    },
    include: { attrs: { include: { attribute: true } } }
  })
  res.status(201).json(position)
}