import { prisma } from '../prisma.js'

export const get = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      profileAttrs: { include: { attribute: true } },
      cvs: { include: { position: { select: { title: true, id: true } } } }
    }
  })
  res.json(user)
}

export const update = async (req, res) => {
  const { firstName, lastName, attributes } = req.body
  await prisma.user.update({ where: { id: req.user.id }, data: { firstName, lastName } })
  if (attributes) {
    for (const [attrId, value] of Object.entries(attributes)) {
      const existing = await prisma.profileAttribute.findUnique({
        where: { userId_attributeId: { userId: req.user.id, attributeId: +attrId } }
      })
      if (existing) {
        await prisma.profileAttribute.update({ where: { id: existing.id }, data: { value } })
      } else {
        await prisma.profileAttribute.create({ data: { userId: req.user.id, attributeId: +attrId, value } })
      }
    }
  }
  res.json(await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profileAttrs: { include: { attribute: true } } }
  }))
}