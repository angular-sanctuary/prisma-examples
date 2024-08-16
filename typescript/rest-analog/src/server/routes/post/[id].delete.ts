import { prisma } from '../../../../prisma/db'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id

  const deletePost = await prisma.post
    .delete({
      where: {
        //@ts-ignore
        id: parseInt(id),
      },
    })
    .catch((error) => {
      console.error(error)
    })

  return deletePost
})
