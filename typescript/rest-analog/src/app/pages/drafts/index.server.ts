import { PageServerLoad } from '@analogjs/router'
import { Post } from '../../models/post.model'

export const load = async ({ fetch }: PageServerLoad): Promise<Post[]> => {
  return await fetch<Post[]>('/draft-list')
}
