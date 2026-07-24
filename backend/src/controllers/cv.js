import { prisma } from '../prisma.js'

export const getMy = async (req, res) => {
  res.json(await prisma.cV.findMany({
    where: { userId: req.user.id },
    include: { position: { select: { title: true, id: true } } }
  }))
}

export const getAll = async (req, res) => {
  try {
    const cvs = await prisma.cV.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        position: { select: { title: true } }
      }
    })
    res.json(cvs)
  } catch (error) {
    console.error('Error in getAll:', error)
    res.status(500).json({ error: 'Failed to fetch CVs' })
  }
}

export const getOne = async (req, res) => {
  const cv = await prisma.cV.findUnique({
    where: { id: +req.params.id },
    include: {
      user: { select: { firstName: true, lastName: true } },
      position: { include: { attrs: { include: { attribute: true } } } },
      attrs: { include: { attribute: true } }
    }
  })
  if (!cv) return res.status(404).json({ error: 'Not found' })
  const isOwner = cv.userId === req.user.id
  const isRecruiter = ['recruiter', 'admin'].includes(req.user.role)
  if (!isOwner && !isRecruiter) return res.status(403).json({ error: 'Access denied' })
  res.json(cv)
}

export const createOrUpdate = async (req, res) => {
  const { positionId, attributes } = req.body
  const position = await prisma.position.findUnique({
    where: { id: +positionId },
    include: { attrs: { include: { attribute: true } } }
  })
  if (!position) return res.status(404).json({ error: 'Position not found' })
  let cv = await prisma.cV.findFirst({
    where: {
      userId: req.user.id,
      positionId: +positionId
    }
  })

  if (cv) {
    cv = await prisma.cV.update({ where: { id: cv.id }, data: {} })
  } else {
    cv = await prisma.cV.create({ data: { userId: req.user.id, positionId: +positionId } })
    const profileAttrs = await prisma.profileAttribute.findMany({ where: { userId: req.user.id } })
    const profileMap = Object.fromEntries(profileAttrs.map(p => [p.attributeId, p.value]))
    await prisma.cVAttribute.createMany({
      data: position.attrs.map(p => ({
        cvId: cv.id,
        attributeId: p.attributeId,
        value: profileMap[p.attributeId] ?? null,
        isFilled: !!profileMap[p.attributeId]
      }))
    })
  }

  if (attributes) {
    for (const [attrId, value] of Object.entries(attributes)) {
      await prisma.cVAttribute.upsert({
        where: { 
          cvId_attributeId: { 
            cvId: cv.id, 
            attributeId: +attrId 
          } 
        },
        update: { value, isFilled: value !== null && value !== '' },
        create: { cvId: cv.id, attributeId: +attrId, value, isFilled: value !== null && value !== '' }
      })
    }
  }

  res.json(cv)
}

export const getByPosition = async (req, res) => {
  const { positionId } = req.params
  const position = await prisma.position.findUnique({ where: { id: +positionId } })
  if (!position) return res.status(404).json({ error: 'Not found' })
  
  const isRecruiter = ['recruiter', 'admin'].includes(req.user.role)
  if (!isRecruiter && position.recruiterId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' })
  }
  
  res.json(await prisma.cV.findMany({
    where: { positionId: +positionId, isPublished: true },
    include: { user: { select: { firstName: true, lastName: true } } }
  }))
}

export const publish = async (req, res) => {
  const cv = await prisma.cV.findUnique({ where: { id: +req.params.id }, include: { attrs: true } })
  if (!cv) return res.status(404).json({ error: 'Not found' })
  if (cv.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' })
  if (!cv.attrs.every(a => a.isFilled)) return res.status(400).json({ error: 'Empty attributes' })
  res.json(await prisma.cV.update({ where: { id: +req.params.id }, data: { isPublished: true } }))
}
