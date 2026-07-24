import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Пользователи
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    }
  })

  await prisma.user.upsert({
    where: { email: 'recruiter@test.com' },
    update: {},
    create: {
      email: 'recruiter@test.com',
      password: await bcrypt.hash('recruiter123', 10),
      firstName: 'John',
      lastName: 'Recruiter',
      role: 'recruiter'
    }
  })

  await prisma.user.upsert({
    where: { email: 'recruiter2@test.com' },
    update: {},
    create: {
      email: 'recruiter2@test.com',
      password: await bcrypt.hash('recruiter123', 10),
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'recruiter'
    }
  })

  await prisma.user.upsert({
    where: { email: 'candidate@test.com' },
    update: {},
    create: {
      email: 'candidate@test.com',
      password: await bcrypt.hash('candidate123', 10),
      firstName: 'Jane',
      lastName: 'Candidate',
      role: 'candidate'
    }
  })

  await prisma.user.upsert({
    where: { email: 'candidate2@test.com' },
    update: {},
    create: {
      email: 'candidate2@test.com',
      password: await bcrypt.hash('candidate123', 10),
      firstName: 'Michael',
      lastName: 'Developer',
      role: 'candidate'
    }
  })

  await prisma.user.upsert({
    where: { email: 'candidate3@test.com' },
    update: {},
    create: {
      email: 'candidate3@test.com',
      password: await bcrypt.hash('candidate123', 10),
      firstName: 'Anna',
      lastName: 'Designer',
      role: 'candidate'
    }
  })

  // Атрибуты
  await prisma.attribute.createMany({
    data: [
      { name: 'English Level', category: 'Skills', type: 'dropdown', options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
      { name: 'Years of Experience', category: 'Skills', type: 'numeric' },
      { name: 'Remote Work', category: 'Personal', type: 'boolean' },
      { name: 'GPA', category: 'Education', type: 'numeric' },
      { name: 'University', category: 'Education', type: 'string' },
      { name: 'Bio', category: 'Personal', type: 'text' },
      { name: 'Certification', category: 'Certification', type: 'string' },
      { name: 'Preferred Salary', category: 'Personal', type: 'numeric' },
      { name: 'Availability', category: 'Personal', type: 'date' }
    ],
    skipDuplicates: true
  })

  const [englishLevel, experience, remote, gpa, university, bio, certification, salary, availability] =
    await prisma.attribute.findMany()

  // Позиции
  const pos1 = await prisma.position.create({
    data: {
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer with 5+ years of experience.',
      company: 'Tech Corp',
      level: 'Senior',
      recruiterId: (await prisma.user.findUnique({ where: { email: 'recruiter@test.com' } })).id,
      attrs: {
        create: [
          { attributeId: englishLevel.id, order: 0 },
          { attributeId: experience.id, order: 1 },
          { attributeId: remote.id, order: 2 },
          { attributeId: gpa.id, order: 3 },
          { attributeId: university.id, order: 4 }
        ]
      }
    }
  })

  const pos2 = await prisma.position.create({
    data: {
      title: 'DevOps Engineer',
      description: 'Join our infrastructure team to build and maintain cloud infrastructure.',
      company: 'Cloud Solutions Inc',
      level: 'Middle',
      recruiterId: (await prisma.user.findUnique({ where: { email: 'recruiter@test.com' } })).id,
      attrs: {
        create: [
          { attributeId: experience.id, order: 0 },
          { attributeId: remote.id, order: 1 },
          { attributeId: certification.id, order: 2 },
          { attributeId: salary.id, order: 3 }
        ]
      }
    }
  })

  const pos3 = await prisma.position.create({
    data: {
      title: 'UX/UI Designer',
      description: 'We need a creative designer with experience in Figma and design systems.',
      company: 'Creative Studio',
      level: 'Junior',
      recruiterId: (await prisma.user.findUnique({ where: { email: 'recruiter2@test.com' } })).id,
      attrs: {
        create: [
          { attributeId: englishLevel.id, order: 0 },
          { attributeId: experience.id, order: 1 },
          { attributeId: remote.id, order: 2 },
          { attributeId: bio.id, order: 3 }
        ]
      }
    }
  })

  const pos4 = await prisma.position.create({
    data: {
      title: 'Data Scientist',
      description: 'Looking for a data scientist with Python, ML, and statistics background.',
      company: 'AI Research Lab',
      level: 'Senior',
      recruiterId: (await prisma.user.findUnique({ where: { email: 'recruiter2@test.com' } })).id,
      attrs: {
        create: [
          { attributeId: experience.id, order: 0 },
          { attributeId: gpa.id, order: 1 },
          { attributeId: university.id, order: 2 },
          { attributeId: salary.id, order: 3 }
        ]
      }
    }
  })

  const pos5 = await prisma.position.create({
    data: {
      title: 'Full Stack Developer',
      description: 'Full stack developer with experience in React, Node.js, and PostgreSQL.',
      company: 'Startup Hub',
      level: 'Middle',
      recruiterId: (await prisma.user.findUnique({ where: { email: 'recruiter@test.com' } })).id,
      attrs: {
        create: [
          { attributeId: englishLevel.id, order: 0 },
          { attributeId: experience.id, order: 1 },
          { attributeId: remote.id, order: 2 },
          { attributeId: certification.id, order: 3 }
        ]
      }
    }
  })

  // Профили кандидатов
  const candidateUser = await prisma.user.findUnique({ where: { email: 'candidate@test.com' } })
  const candidate2User = await prisma.user.findUnique({ where: { email: 'candidate2@test.com' } })
  const candidate3User = await prisma.user.findUnique({ where: { email: 'candidate3@test.com' } })

  await prisma.profileAttribute.createMany({
    data: [
      { userId: candidateUser.id, attributeId: englishLevel.id, value: 'C1' },
      { userId: candidateUser.id, attributeId: experience.id, value: 5 },
      { userId: candidateUser.id, attributeId: remote.id, value: true },
      { userId: candidateUser.id, attributeId: gpa.id, value: 3.8 },
      { userId: candidateUser.id, attributeId: university.id, value: 'MIT' },
      { userId: candidateUser.id, attributeId: bio.id, value: 'Experienced developer with 5 years in React.' },
      { userId: candidateUser.id, attributeId: salary.id, value: 80000 },
      { userId: candidateUser.id, attributeId: availability.id, value: '2024-09-01' }
    ],
    skipDuplicates: true
  })

  await prisma.profileAttribute.createMany({
    data: [
      { userId: candidate2User.id, attributeId: englishLevel.id, value: 'B2' },
      { userId: candidate2User.id, attributeId: experience.id, value: 3 },
      { userId: candidate2User.id, attributeId: remote.id, value: true },
      { userId: candidate2User.id, attributeId: gpa.id, value: 3.5 },
      { userId: candidate2User.id, attributeId: university.id, value: 'Stanford' },
      { userId: candidate2User.id, attributeId: bio.id, value: 'Full stack developer passionate about clean code.' },
      { userId: candidate2User.id, attributeId: certification.id, value: 'AWS Certified' }
    ],
    skipDuplicates: true
  })

  await prisma.profileAttribute.createMany({
    data: [
      { userId: candidate3User.id, attributeId: englishLevel.id, value: 'C2' },
      { userId: candidate3User.id, attributeId: experience.id, value: 2 },
      { userId: candidate3User.id, attributeId: remote.id, value: false },
      { userId: candidate3User.id, attributeId: university.id, value: 'RISD' },
      { userId: candidate3User.id, attributeId: bio.id, value: 'Creative designer with focus on user-centered design.' }
    ],
    skipDuplicates: true
  })

  // CV
  await prisma.cV.create({
    data: {
      userId: candidateUser.id,
      positionId: pos1.id,
      isPublished: true,
      attrs: {
        create: [
          { attributeId: englishLevel.id, value: 'C1', isFilled: true },
          { attributeId: experience.id, value: 5, isFilled: true },
          { attributeId: remote.id, value: true, isFilled: true },
          { attributeId: gpa.id, value: 3.8, isFilled: true },
          { attributeId: university.id, value: 'MIT', isFilled: true }
        ]
      }
    }
  })

  await prisma.cV.create({
    data: {
      userId: candidate2User.id,
      positionId: pos2.id,
      isPublished: true,
      attrs: {
        create: [
          { attributeId: experience.id, value: 3, isFilled: true },
          { attributeId: remote.id, value: true, isFilled: true },
          { attributeId: certification.id, value: 'AWS Certified', isFilled: true },
          { attributeId: salary.id, value: 70000, isFilled: true }
        ]
      }
    }
  })

  await prisma.cV.create({
    data: {
      userId: candidate3User.id,
      positionId: pos3.id,
      isPublished: true,
      attrs: {
        create: [
          { attributeId: englishLevel.id, value: 'C2', isFilled: true },
          { attributeId: experience.id, value: 2, isFilled: true },
          { attributeId: remote.id, value: false, isFilled: true },
          { attributeId: bio.id, value: 'Creative designer with focus on user-centered design.', isFilled: true }
        ]
      }
    }
  })

  await prisma.cV.create({
    data: {
      userId: candidate2User.id,
      positionId: pos1.id,
      isPublished: false,
      attrs: {
        create: [
          { attributeId: englishLevel.id, value: 'B2', isFilled: true },
          { attributeId: experience.id, value: 3, isFilled: true },
          { attributeId: remote.id, value: true, isFilled: true },
          { attributeId: gpa.id, value: 3.5, isFilled: true },
          { attributeId: university.id, value: 'Stanford', isFilled: true }
        ]
      }
    }
  })

  await prisma.cV.create({
    data: {
      userId: candidateUser.id,
      positionId: pos5.id,
      isPublished: true,
      attrs: {
        create: [
          { attributeId: englishLevel.id, value: 'C1', isFilled: true },
          { attributeId: experience.id, value: 5, isFilled: true },
          { attributeId: remote.id, value: true, isFilled: true },
          { attributeId: certification.id, value: null, isFilled: false }
        ]
      }
    }
  })

  console.log('✅ Seed completed')
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())