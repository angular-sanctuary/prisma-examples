import { prisma } from '../../../prisma/db'

export default defineEventHandler(async () => {
  const feed = await prisma.post
    .findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
    })
    .catch((error) => {
      console.error(error)
    })

  return feed
})
