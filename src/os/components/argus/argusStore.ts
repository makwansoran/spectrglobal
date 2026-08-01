export interface ArgusFeed {
  id: string
  name: string
  createdAt: number
}

export interface ArgusDashboard {
  id: string
  name: string
  createdAt: number
  feeds: ArgusFeed[]
}

const STORAGE_KEY = 'spectr-argus-dashboards-v1'

export function readDashboards(): ArgusDashboard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ArgusDashboard[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((d) => ({
      ...d,
      feeds: Array.isArray(d.feeds) ? d.feeds : []
    }))
  } catch {
    return []
  }
}

export function writeDashboards(list: ArgusDashboard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function createDashboard(name: string): ArgusDashboard {
  return {
    id: `dash_${Date.now().toString(36)}`,
    name,
    createdAt: Date.now(),
    feeds: []
  }
}

export function createFeed(name: string): ArgusFeed {
  return {
    id: `feed_${Date.now().toString(36)}`,
    name,
    createdAt: Date.now()
  }
}
