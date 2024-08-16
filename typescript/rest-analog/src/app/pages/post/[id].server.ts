import { PageServerLoad } from '@analogjs/router'
import { Post } from '../../models/post.model'

export const load = async ({
  fetch,
  params,
}: PageServerLoad): Promise<Post> => {
  return await fetch<Post>(`/api/post/${params?.['id']}`)
}
