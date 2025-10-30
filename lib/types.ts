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

const getFilterValue = (value: string) => (value === "all" ? undefined : value);
export { getFilterValue as getFilteredvalue };