/**
 * Renderer-side platform facade.
 *
 * All platform state lives in the main process, so this is a thin bridge plus a
 * subscription. When there is no Electron bridge (plain browser dev) it degrades
 * to an empty platform rather than throwing, so the shell still renders.
 */

import { useEffect, useState } from 'react'
import type {
  DashboardWidget,
  Dataset,
  DatasetPage,
  FeedConfig,
  FeedDef,
  LinkCardinality,
  LinkTypeDef,
  LinkedObjects,
  ObjectInstance,
  ObjectMapping,
  ObjectProperty,
  ObjectQuery,
  ObjectQueryResult,
  ObjectTypeDef,
  PlatformSnapshot,
  PreviewResult,
  TransformConfig,
  TransformDef,
  WidgetOverride
} from '@/os/shared/platform'

export type * from '@/os/shared/platform'

export const EMPTY_SNAPSHOT: PlatformSnapshot = {
  feeds: [],
  datasets: [],
  transforms: [],
  objectTypes: [],
  linkTypes: [],
  widgetOverrides: []
}

type PlatformBridge = NonNullable<Window['spectr']>['platform']

function bridge(): PlatformBridge | null {
  if (typeof window === 'undefined') return null
  return window.spectr?.platform ?? null
}

function unavailable(): never {
  throw new Error('Platform is only available inside the Spectr app')
}

/* ------------------------------------------------------------------ reading */

export async function getSnapshot(): Promise<PlatformSnapshot> {
  return (await bridge()?.snapshot()) ?? EMPTY_SNAPSHOT
}

export async function getDashboard(): Promise<DashboardWidget[]> {
  return (await bridge()?.dashboard()) ?? []
}

export async function getRows(
  datasetId: string,
  limit?: number,
  offset?: number
): Promise<DatasetPage | null> {
  return (await bridge()?.rows(datasetId, limit, offset)) ?? null
}

export async function resolveCode(code: string): Promise<{ kind: string; id: string } | null> {
  return (await bridge()?.resolveCode(code)) ?? null
}

/* -------------------------------------------------------------------- feeds */

export async function previewFeed(config: FeedConfig): Promise<PreviewResult> {
  const api = bridge()
  if (!api) unavailable()
  return api.previewFeed(config)
}

export async function listExcelSheets(base64: string): Promise<string[]> {
  return (await bridge()?.excelSheets(base64)) ?? []
}

export async function createFeed(input: {
  label: string
  config: FeedConfig
  code?: string
  description?: string
}): Promise<FeedDef> {
  const api = bridge()
  if (!api) unavailable()
  return api.createFeed(input)
}

export async function updateFeed(
  id: string,
  patch: { label?: string; description?: string; config?: FeedConfig }
): Promise<FeedDef | null> {
  return (await bridge()?.updateFeed(id, patch)) ?? null
}

export async function deleteFeed(id: string): Promise<boolean> {
  return (await bridge()?.deleteFeed(id)) ?? false
}

export async function reloadFeed(id: string): Promise<FeedDef | null> {
  return (await bridge()?.reloadFeed(id)) ?? null
}

export async function pushRows(
  feedId: string,
  records: Array<Record<string, unknown>>
): Promise<Dataset | null> {
  return (await bridge()?.pushRows(feedId, records)) ?? null
}

/* --------------------------------------------------------------- transforms */

export async function createTransform(input: {
  label: string
  config: TransformConfig
  code?: string
}): Promise<TransformDef> {
  const api = bridge()
  if (!api) unavailable()
  return api.createTransform(input)
}

export async function updateTransform(
  id: string,
  patch: { label?: string; config?: TransformConfig }
): Promise<TransformDef | null> {
  return (await bridge()?.updateTransform(id, patch)) ?? null
}

export async function deleteTransform(id: string): Promise<boolean> {
  return (await bridge()?.deleteTransform(id)) ?? false
}

/* ------------------------------------------------------------- object types */

export async function createObjectType(input: {
  label: string
  plural?: string
  keyProperty: string
  titleProperty?: string
  properties: ObjectProperty[]
  mappings?: ObjectMapping[]
  code?: string
}): Promise<ObjectTypeDef> {
  const api = bridge()
  if (!api) unavailable()
  return api.createObjectType(input)
}

export async function updateObjectType(
  id: string,
  patch: {
    label?: string
    plural?: string
    keyProperty?: string
    titleProperty?: string | null
    properties?: ObjectProperty[]
    mappings?: ObjectMapping[]
  }
): Promise<ObjectTypeDef | null> {
  return (await bridge()?.updateObjectType(id, patch)) ?? null
}

export async function deleteObjectType(id: string): Promise<boolean> {
  return (await bridge()?.deleteObjectType(id)) ?? false
}

/* --------------------------------------------------------------- link types */

export interface CreateLinkTypeArgs {
  label: string
  reverseLabel?: string
  sourceObjectTypeId: string
  targetObjectTypeId: string
  cardinality: LinkCardinality
  on: { sourceProperty: string; targetProperty: string }
  through?: { datasetId: string; sourceColumn: string; targetColumn: string }
  code?: string
}

export async function createLinkType(input: CreateLinkTypeArgs): Promise<LinkTypeDef> {
  const api = bridge()
  if (!api) unavailable()
  return api.createLinkType(input)
}

export async function updateLinkType(
  id: string,
  patch: Partial<CreateLinkTypeArgs>
): Promise<LinkTypeDef | null> {
  return (await bridge()?.updateLinkType(id, patch)) ?? null
}

export async function deleteLinkType(id: string): Promise<boolean> {
  return (await bridge()?.deleteLinkType(id)) ?? false
}

/* ---------------------------------------------------------------- instances */

export async function searchObjects(query: ObjectQuery): Promise<ObjectQueryResult> {
  return (
    (await bridge()?.searchObjects(query)) ?? {
      objectTypeId: query.objectTypeId,
      instances: [],
      total: 0
    }
  )
}

export async function getInstance(id: string): Promise<ObjectInstance | null> {
  return (await bridge()?.instance(id)) ?? null
}

/** An instance plus every link it participates in. */
export async function getInstanceContext(
  id: string
): Promise<{ instance: ObjectInstance; links: LinkedObjects[] } | null> {
  const result = await bridge()?.instanceContext(id)
  if (!result || typeof result !== 'object') return null
  if (!('instance' in result) || !('links' in result)) return null
  return result as { instance: ObjectInstance; links: LinkedObjects[] }
}

export async function followLink(
  instanceId: string,
  linkTypeId: string,
  direction: 'forward' | 'reverse' = 'forward',
  limit?: number
): Promise<LinkedObjects | null> {
  return (await bridge()?.followLink(instanceId, linkTypeId, direction, limit)) ?? null
}

export async function isDatasetWritable(datasetId: string): Promise<boolean> {
  return (await bridge()?.datasetWritable(datasetId)) ?? false
}

/* ------------------------------------------------------------------ widgets */

export async function setWidgetOverride(override: WidgetOverride): Promise<void> {
  await bridge()?.setWidgetOverride(override)
}

export async function resetWidgetOverride(widgetId: string): Promise<void> {
  await bridge()?.resetWidgetOverride(widgetId)
}

/* -------------------------------------------------------------------- hooks */

/**
 * Live platform state. The main process pushes a new snapshot after every
 * settled build, so views never poll and never show a half-built graph.
 */
export function usePlatform(): { snapshot: PlatformSnapshot; loading: boolean } {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(EMPTY_SNAPSHOT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    void getSnapshot().then((next) => {
      if (!active) return
      setSnapshot(next)
      setLoading(false)
    })

    const off = bridge()?.onChanged((next) => {
      if (active) setSnapshot(next)
    })

    return () => {
      active = false
      off?.()
    }
  }, [])

  return { snapshot, loading }
}

/** Dashboard widgets, recomputed whenever platform state settles. */
export function useDashboard(): { widgets: DashboardWidget[]; loading: boolean } {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = (): void => {
      void getDashboard().then((next) => {
        if (!active) return
        setWidgets(next)
        setLoading(false)
      })
    }

    load()
    const off = bridge()?.onChanged(load)

    return () => {
      active = false
      off?.()
    }
  }, [])

  return { widgets, loading }
}
