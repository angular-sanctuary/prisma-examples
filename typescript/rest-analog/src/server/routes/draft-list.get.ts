import { prisma } from '../../../prisma/db'

export default defineEventHandler(async () => {
  const posts = await prisma.post
    .findMany({
      where: {
        published: false,
      },
      include: {
        author: true,
      },
    })
    .catch((error) => {
      console.error(error)
    })

  return posts
})
