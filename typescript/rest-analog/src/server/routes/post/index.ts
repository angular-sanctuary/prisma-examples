import { prisma } from '../../../../prisma/db'

export default defineEventHandler(async (event) => {
  const { title, content, authorEmail } = await readBody(event)

  const createPost = await prisma.post
    .create({
      data: {
        title,
        content,
        published: false,
        author: {
          connect: {
            email: authorEmail,
          },
        },
      },
    })
    .catch((error) => {
      console.error(error)
    })

  return createPost
})
