export type ViewId =
  | 'command'
  | 'metaphysics'
  | 'catalog'
  | 'map'
  | 'argus'
  | 'digitwin'
  | 'settings'

export const VIEW_META: Record<
  Exclude<ViewId, 'command' | 'metaphysics' | 'catalog' | 'map' | 'argus'>,
  { title: string; description: string }
> = {
  digitwin: {
    title: 'Digi TWIN',
    description: 'Live digital twin of your operating environment.'
  },
  settings: {
    title: 'Settings',
    description: 'Data plane and agent configuration.'
  }
}
