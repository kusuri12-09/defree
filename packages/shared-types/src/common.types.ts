export interface PaginationMeta {
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  code: string
  message: string
}
