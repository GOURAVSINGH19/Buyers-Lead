export interface CSVImportResult {
  success: boolean
  imported: number
  errors: string[]
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}
