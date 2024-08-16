import { Author } from './author.model'

export type Post = {
  id: number
  title: string
  author: Author
  content: string
  published: boolean
}
