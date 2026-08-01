/** Feed module catalog used by the data-feed picker. */

export interface CatalogItem {
  id: string
  name: string
  description: string
  color?: string
  soft?: string
}

export const FEED_TYPES: CatalogItem[] = [
  { id: 'csv', name: 'CSV file', description: 'Paste a spreadsheet export.', color: '#0891b2' },
  { id: 'excel', name: 'Excel sheet', description: 'Import from an .xlsx workbook.', color: '#0891b2' },
  {
    id: 'http.poll',
    name: 'HTTP endpoint',
    description: 'Pull JSON or CSV on a schedule.',
    color: '#0891b2'
  },
  {
    id: 'http.push',
    name: 'HTTP push',
    description: 'Receive records posted to Spectr.',
    color: '#0891b2'
  },
  {
    id: 'db.table',
    name: 'Database table',
    description: 'Use a local Spectr table.',
    color: '#0891b2'
  },
  {
    id: 'static',
    name: 'Manual rows',
    description: 'Empty table you fill yourself.',
    color: '#0891b2'
  }
]
