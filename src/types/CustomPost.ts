import type { CustomComment } from './CustomComment'

export type CustomPost = {
  id: number
  title: string
  body: string
  comments: CustomComment[]
}
