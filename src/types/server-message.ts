export type ServerMessagePOSTType<T> = {
  status: 'success' | 'error'
  heading: string
  description?: string
  result?: T
}
