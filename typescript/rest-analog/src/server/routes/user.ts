import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event) => {
  const { name, email } = await readBody(event)

  const createUser = await prisma.user
    .create({
      data: {
        name,
        email,
      },
    })
    .catch((error) => {
      console.error(error)
    })

  return createUser
})
