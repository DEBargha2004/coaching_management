export type ServerMessagePOSTType<T = any> = {
  status: 'success' | 'error'
  heading: string
  description?: string
  result?: T
}

export type ServerMessageGETType<T = any> = {
  status: 'success' | 'error'
  heading: string
  description?: string
  result?: T
}
