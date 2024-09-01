import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    return user
  } catch (error) {
    console.error(error)
  }
})
