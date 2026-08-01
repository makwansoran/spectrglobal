export type ViewId = 'command' | 'metaphysics' | 'catalog' | 'map' | 'argus' | 'settings'

export const VIEW_META: Record<
  Exclude<ViewId, 'command' | 'metaphysics' | 'catalog' | 'map' | 'argus'>,
  { title: string; description: string }
> = {
  settings: {
    title: 'Settings',
    description: 'Data plane and agent configuration.'
  }
}
