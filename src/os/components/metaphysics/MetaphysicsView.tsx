import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type MouseEvent as ReactMouseEvent
} from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  SelectionMode,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type NodeChange,
  MarkerType,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import MetaphysicsNodeCard, { type MetaphysicsFlowNode } from './MetaphysicsNodeCard'
import CanvasContextMenu from './CanvasContextMenu'
import MetaphysicsNavbar, { type NewNodeKind } from './MetaphysicsNavbar'
import NodeDatasetPanel, { type InspectTarget } from './NodeDatasetPanel'
import type { CanvasDataOption } from './UnionInputsPicker'
import {
  COMMAND_NODE_ID,
  EDGE_FLOW,
  isCommandNode,
  normalizeEdgeStatus,
  type ModelEdge,
  type ModelNode
} from '../../lib/model'
import { projectMetaphysics } from '../../lib/metaphysicsGraph'
import {
  addDraft,
  forgetLayout,
  readDrafts,
  readLayout,
  removeDraft,
  renameDraft,
  upsertLayout
} from '../../lib/metaphysicsLayout'
import {
  createFeed,
  createTransform,
  deleteFeed,
  deleteTransform,
  updateFeed,
  updateTransform,
  usePlatform
} from '../../lib/platform'
import {
  allocateDraftId,
  allocateUniqueFeedLabel
} from '../../lib/feedIdentity'
import type { SourceCommit } from './FeedSourceSetup'

const nodeTypes = { spectr: MetaphysicsNodeCard }

function toFlowEdge(e: ModelEdge): Edge {
  const status = normalizeEdgeStatus(e.status)
  const flow = EDGE_FLOW[status]
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    className: flow.className,
    deletable: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: flow.stroke
    },
    style: { stroke: flow.stroke, strokeWidth: 2 },
    data: { kind: e.kind, status }
  }
}

function MetaphysicsCanvas(): JSX.Element {
  const { snapshot } = usePlatform()
  const [drafts, setDrafts] = useState(readDrafts)
  const [nodes, setNodes, onNodesChange] = useNodesState<MetaphysicsFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [inspectedId, setInspectedId] = useState<string | null>(null)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [panelDismissed, setPanelDismissed] = useState(false)
  const { fitView } = useReactFlow()
  const fitted = useRef(false)
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot

  const paint = useCallback(
    (graphNodes: ModelNode[], graphEdges: ModelEdge[]) => {
      setNodes((current) => {
        const selected = new Set(current.filter((n) => n.selected).map((n) => n.id))
        return graphNodes.map((n) => {
          const isCommand = n.kind === 'command'
          return {
            id: n.id,
            type: 'spectr' as const,
            position: { x: n.x, y: n.y },
            deletable: !isCommand,
            draggable: true,
            selectable: true,
            selected: selected.has(n.id),
            style: { overflow: 'visible' as const },
            data: {
              kind: n.kind,
              label: n.label,
              code: n.code,
              qty: n.qty,
              status: n.status,
              detail: n.detail,
              module: n.module
            }
          }
        })
      })
      setEdges(graphEdges.map(toFlowEdge))
    },
    [setEdges, setNodes]
  )

  const rebuild = useCallback(() => {
    const nextDrafts = readDrafts()
    setDrafts(nextDrafts)
    const graph = projectMetaphysics(snapshotRef.current, readLayout(), nextDrafts)
    paint(graph.nodes, graph.edges)
  }, [paint])

  const placeNearCommand = (id: string, column: 'left' | 'mid' | 'right'): void => {
    const layout = readLayout()
    const command = layout[COMMAND_NODE_ID] ?? { x: 520, y: 280 }
    const graph = projectMetaphysics(snapshotRef.current, layout, readDrafts())
    const siblings = graph.nodes.filter((n) => n.id !== COMMAND_NODE_ID && n.id !== id)
    const x =
      column === 'left' ? command.x - 520 : column === 'right' ? command.x + 280 : command.x - 280
    upsertLayout([
      {
        id,
        x,
        y: command.y + siblings.length * 110 - 40
      }
    ])
  }

  const selectNode = (id: string): void => {
    setNodes((current) => current.map((n) => ({ ...n, selected: n.id === id })))
    setSelectedIds([id])
    setInspectedId(id)
    setPanelDismissed(false)
  }

  const findUnionTransform = useCallback((id: string | null | undefined) => {
    if (!id) return null
    const t = snapshotRef.current.transforms.find((x) => x.id === id)
    if (!t || t.config.kind !== 'union') return null
    return t
  }, [])

  /**
   * Wiring target: the Union currently being configured.
   * Prefer the inspected panel target; fall back to a single selected Union on the canvas.
   */
  const wiringUnionId = useMemo(() => {
    if (inspectedId) {
      const t = snapshot.transforms.find((x) => x.id === inspectedId)
      if (t?.config.kind === 'union') return t.id
    }
    if (selectedIds.length === 1) {
      const t = snapshot.transforms.find((x) => x.id === selectedIds[0])
      if (t?.config.kind === 'union') return t.id
    }
    return null
  }, [inspectedId, selectedIds, snapshot.transforms])

  const wiringUnionIdRef = useRef(wiringUnionId)
  wiringUnionIdRef.current = wiringUnionId

  const isDataNodeId = (nodeId: string): boolean =>
    Boolean(snapshotRef.current.feeds.some((f) => f.id === nodeId)) ||
    readDrafts().some((d) => d.id === nodeId && (d.kind === 'data' || !d.kind))

  /** Attach / detach a data feed → keeps Union focused so edges stay visible. */
  const toggleFeedOnUnion = async (
    feedId: string,
    unionId = wiringUnionIdRef.current
  ): Promise<void> => {
    if (!unionId) return
    const union = findUnionTransform(unionId)
    if (!union || union.config.kind !== 'union') return

    const feed = snapshotRef.current.feeds.find((f) => f.id === feedId)
    if (!feed?.datasetId) {
      setNotice('Connect a source on that Data node before attaching it to Union')
      selectNode(union.id)
      return
    }

    // Always read latest inputs from the ref snapshot (supports rapid multi-attach).
    const latest = findUnionTransform(union.id)
    const inputs =
      latest && latest.config.kind === 'union' ? [...latest.config.inputs] : [...union.config.inputs]
    const next = inputs.includes(feed.datasetId)
      ? inputs.filter((id) => id !== feed.datasetId)
      : [...inputs, feed.datasetId]

    try {
      const updated = await updateTransform(union.id, {
        config: {
          kind: 'union',
          inputs: next,
          mode: 'byName',
          sourceColumn: 'source'
        }
      })
      if (!updated) throw new Error('Could not update union')
      // Paint edges immediately — platform onChanged may arrive a tick later.
      snapshotRef.current = {
        ...snapshotRef.current,
        transforms: snapshotRef.current.transforms.map((t) =>
          t.id === updated.id ? updated : t
        )
      }
      rebuild()
      selectNode(union.id)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not attach data to union')
      selectNode(union.id)
    }
  }

  const handleCanvasNodeClick = (nodeId: string): void => {
    if (isCommandNode(nodeId)) return

    // While wiring a Union, clicking Data attaches a line — never open Data config.
    if (wiringUnionIdRef.current && isDataNodeId(nodeId)) {
      void toggleFeedOnUnion(nodeId, wiringUnionIdRef.current)
      return
    }

    selectNode(nodeId)
  }

  const handleConnect = (connection: Connection): void => {
    const source = connection.source
    const target = connection.target
    if (!source || !target) return
    if (!isDataNodeId(source)) return
    if (!findUnionTransform(target)) return
    void toggleFeedOnUnion(source, target)
  }

  const isValidConnection = (connection: Connection | Edge): boolean => {
    const source = connection.source
    const target = connection.target
    if (!source || !target) return false
    return isDataNodeId(source) && Boolean(findUnionTransform(target))
  }

  const addNewNode = async (kind: NewNodeKind): Promise<void> => {
    const takenIds = [
      ...snapshotRef.current.feeds.map((f) => f.id),
      ...snapshotRef.current.transforms.map((t) => t.id),
      ...readDrafts().map((d) => d.id),
      COMMAND_NODE_ID
    ]
    const takenLabels = [
      ...snapshotRef.current.feeds.map((f) => f.label),
      ...snapshotRef.current.transforms.map((t) => t.label),
      ...readDrafts().map((d) => d.label)
    ]

    if (kind === 'data') {
      const id = allocateDraftId(takenIds)
      const label = allocateUniqueFeedLabel(takenLabels, 'Data')
      placeNearCommand(id, 'left')
      addDraft({ id, label, kind: 'data' })
      rebuild()
      selectNode(id)
      return
    }

    if (kind === 'agent') {
      const id = allocateDraftId(takenIds)
      const label = allocateUniqueFeedLabel(takenLabels, 'AI Agent')
      placeNearCommand(id, 'right')
      addDraft({ id, label, kind: 'agent' })
      rebuild()
      selectNode(id)
      return
    }

    if (kind === 'action') {
      const id = allocateDraftId(takenIds)
      const label = allocateUniqueFeedLabel(takenLabels, 'Action')
      placeNearCommand(id, 'right')
      addDraft({ id, label, kind: 'action' })
      rebuild()
      selectNode(id)
      return
    }

    // union — persisted transform with unique id/code/label
    try {
      const label = allocateUniqueFeedLabel(takenLabels, 'Union')
      const transform = await createTransform({
        label,
        config: { kind: 'union', inputs: [], mode: 'byName', sourceColumn: 'source' }
      })
      placeNearCommand(transform.id, 'mid')
      rebuild()
      selectNode(transform.id)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not create union')
    }
  }

  useEffect(() => {
    rebuild()
    if (!fitted.current) {
      fitted.current = true
      window.requestAnimationFrame(() => fitView({ padding: 0.35, duration: 240 }))
    }
  }, [snapshot, rebuild, fitView])

  useEffect(() => {
    const loadTables = async (): Promise<void> => {
      try {
        const list = await window.spectr?.data?.listTables?.()
        if (Array.isArray(list)) {
          setTables(
            list
              .map((t) =>
                t && typeof t === 'object' && 'name' in t ? String((t as { name: string }).name) : ''
              )
              .filter(Boolean)
          )
        }
      } catch {
        setTables([])
      }
    }
    void loadTables()
  }, [])

  const persistPositions = useCallback((list: MetaphysicsFlowNode[]): void => {
    upsertLayout(list.map((n) => ({ id: n.id, x: n.position.x, y: n.position.y })))
  }, [])

  const handleNodesChange = useCallback(
    (changes: NodeChange<MetaphysicsFlowNode>[]) => {
      for (const c of changes) {
        if (c.type !== 'remove') continue
        if (isCommandNode(c.id)) continue
        if (readDrafts().some((d) => d.id === c.id)) {
          removeDraft(c.id)
          continue
        }
        if (snapshotRef.current.feeds.some((f) => f.id === c.id)) {
          forgetLayout([c.id])
          void deleteFeed(c.id)
          continue
        }
        if (snapshotRef.current.transforms.some((t) => t.id === c.id)) {
          forgetLayout([c.id])
          void deleteTransform(c.id)
        }
      }
      onNodesChange(changes.filter((c) => !(c.type === 'remove' && isCommandNode(c.id))))
      const ended = changes.filter(
        (c) => c.type === 'position' && 'dragging' in c && c.dragging === false
      )
      if (ended.length > 0) {
        setNodes((current) => {
          persistPositions(current)
          return current
        })
      }
    },
    [onNodesChange, persistPositions, setNodes]
  )

  const applySourceToTarget = async (
    target: InspectTarget,
    commit: SourceCommit
  ): Promise<void> => {
    const layout = readLayout()

    if (target.kind === 'draft') {
      const label =
        commit.label?.trim() ||
        allocateUniqueFeedLabel(
          [
            ...snapshotRef.current.feeds.map((f) => f.label),
            ...readDrafts().filter((d) => d.id !== target.id).map((d) => d.label)
          ],
          target.label
        )
      const pos = layout[target.id] ?? { x: 240, y: 280 }
      const feed = await createFeed({
        label,
        description: commit.description,
        config: commit.config
      })
      removeDraft(target.id)
      upsertLayout([{ id: feed.id, x: pos.x, y: pos.y }])
      rebuild()
      setNodes((current) => current.map((n) => ({ ...n, selected: n.id === feed.id })))
      setSelectedIds([feed.id])
      return
    }

    if (target.kind === 'feed') {
      await updateFeed(target.feed.id, {
        label: commit.label?.trim() || undefined,
        description: commit.description,
        config: commit.config
      })
      rebuild()
    }
  }

  const selectedFeeds = useMemo(() => {
    return selectedIds
      .map((id) => snapshot.feeds.find((f) => f.id === id))
      .filter((f): f is NonNullable<typeof f> => Boolean(f))
  }, [selectedIds, snapshot.feeds])

  const canUnion = selectedFeeds.length >= 2

  const inspectTarget = useMemo((): InspectTarget | null => {
    if (!inspectedId || isCommandNode(inspectedId)) return null
    const id = inspectedId
    const draft = drafts.find((d) => d.id === id)
    if (draft) {
      if (draft.kind === 'agent' || draft.kind === 'action') return null
      return { kind: 'draft', id: draft.id, label: draft.label }
    }
    const feed = snapshot.feeds.find((f) => f.id === id)
    if (feed) {
      return {
        kind: 'feed',
        feed,
        dataset: snapshot.datasets.find((d) => d.id === feed.datasetId) ?? null
      }
    }
    const transform = snapshot.transforms.find((t) => t.id === id)
    if (transform) {
      return {
        kind: 'transform',
        transform,
        dataset: snapshot.datasets.find((d) => d.id === transform.outputDatasetId) ?? null
      }
    }
    return null
  }, [inspectedId, drafts, snapshot.feeds, snapshot.datasets, snapshot.transforms])

  const showDatasetPanel = Boolean(inspectTarget) && !panelDismissed

  const canvasDataNodes = useMemo((): CanvasDataOption[] => {
    const fromFeeds: CanvasDataOption[] = snapshot.feeds.map((f) => {
      const ds = snapshot.datasets.find((d) => d.id === f.datasetId)
      return {
        id: f.id,
        label: f.label,
        code: f.code,
        datasetId: f.datasetId || null,
        rowCount: ds?.rowCount,
        ready: Boolean(f.datasetId)
      }
    })
    const feedIds = new Set(fromFeeds.map((f) => f.id))
    const fromDrafts: CanvasDataOption[] = drafts
      .filter((d) => (d.kind === 'data' || !d.kind) && !feedIds.has(d.id))
      .map((d) => ({
        id: d.id,
        label: d.label,
        datasetId: null,
        ready: false
      }))
    return [...fromFeeds, ...fromDrafts]
  }, [snapshot.feeds, snapshot.datasets, drafts])

  const openContextMenu = (event: ReactMouseEvent | MouseEvent): void => {
    if (selectedIds.length < 2) return
    event.preventDefault()
    setMenu({ x: event.clientX, y: event.clientY })
  }

  const unionSelected = async (): Promise<void> => {
    setMenu(null)
    if (!canUnion) {
      setNotice('Select at least two configured data feeds to union')
      return
    }

    const datasetIds = selectedFeeds.map((f) => f.datasetId)
    const takenLabels = [
      ...snapshot.feeds.map((f) => f.label),
      ...snapshot.transforms.map((t) => t.label)
    ]
    const label = allocateUniqueFeedLabel(takenLabels, `Union of ${selectedFeeds.length} feeds`)
    const layout = readLayout()
    const command = layout[COMMAND_NODE_ID] ?? { x: 520, y: 280 }
    const xs = selectedFeeds.map((f) => layout[f.id]?.x ?? command.x - 520)
    const ys = selectedFeeds.map((f) => layout[f.id]?.y ?? command.y)
    const midX = xs.reduce((a, b) => a + b, 0) / xs.length
    const midY = ys.reduce((a, b) => a + b, 0) / ys.length

    try {
      const transform = await createTransform({
        label,
        config: {
          kind: 'union',
          inputs: datasetIds,
          mode: 'byName',
          sourceColumn: 'source'
        }
      })
      upsertLayout([
        {
          id: transform.id,
          x: Math.round((midX + command.x) / 2),
          y: Math.round(midY)
        }
      ])
      rebuild()
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not create union')
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <MetaphysicsNavbar onAddNode={(kind) => void addNewNode(kind)} />

      <div className="relative min-h-0 flex-1">
        {wiringUnionId ? (
          <div className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-sm bg-ink px-3 py-1.5 text-[12px] text-white shadow-panel">
            Click Data feeds or drag a line into Union to attach
          </div>
        ) : selectedIds.length > 1 ? (
          <div className="pointer-events-none absolute right-6 top-5 z-10 rounded-sm bg-ink px-3 py-1.5 text-[12px] text-white shadow-panel">
            {selectedIds.length} selected · right-click to union
          </div>
        ) : null}

        {notice ? (
          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-ink px-3 py-2 text-[12px] text-white shadow-panel">
            {notice}
            <button type="button" className="ml-3 underline" onClick={() => setNotice(null)}>
              Dismiss
            </button>
          </div>
        ) : null}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          isValidConnection={isValidConnection}
          onNodeClick={(_, node) => handleCanvasNodeClick(node.id)}
          onSelectionChange={({ nodes: selected }) => {
            setSelectedIds(selected.map((n) => n.id))
            setMenu(null)
          }}
          onPaneClick={() => setMenu(null)}
          onNodeContextMenu={openContextMenu}
          onSelectionContextMenu={openContextMenu}
          onPaneContextMenu={(event) => {
            if (selectedIds.length >= 2) openContextMenu(event)
          }}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-base-900"
          nodesConnectable
          nodesFocusable
          elementsSelectable
          selectNodesOnDrag={false}
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          panOnDrag={[1, 2]}
          panOnScroll
          multiSelectionKeyCode={['Meta', 'Control', 'Shift']}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#d4d7de" />
          <Controls showInteractive={false} />
        </ReactFlow>

        {menu ? (
          <CanvasContextMenu
            x={menu.x}
            y={menu.y}
            onClose={() => setMenu(null)}
            onPick={(id) => {
              if (id === 'union') void unionSelected()
            }}
            items={[
              {
                id: 'union',
                label: 'Union them',
                description: canUnion
                  ? `Stack ${selectedFeeds.length} feeds into one dataset for Command`
                  : 'Select two or more configured data feeds',
                disabled: !canUnion
              }
            ]}
          />
        ) : null}
      </div>

      {showDatasetPanel && inspectTarget ? (
        <NodeDatasetPanel
          target={inspectTarget}
          tables={tables}
          canvasDataNodes={canvasDataNodes}
          onClose={() => {
            setPanelDismissed(true)
            setInspectedId(null)
          }}
          onApplySource={applySourceToTarget}
          onUnionSaved={() => rebuild()}
          onToggleUnionFeed={(feedId) => void toggleFeedOnUnion(feedId)}
          onRenameDraft={(draftId, label) => {
            const taken = [
              ...snapshot.feeds.map((f) => f.label),
              ...readDrafts().filter((d) => d.id !== draftId).map((d) => d.label)
            ]
            const unique =
              taken.some((t) => t.toLowerCase() === label.trim().toLowerCase())
                ? allocateUniqueFeedLabel(taken, label.trim())
                : label.trim()
            renameDraft(draftId, unique)
            rebuild()
          }}
        />
      ) : null}
    </div>
  )
}

export default function MetaphysicsView(): JSX.Element {
  return (
    <ReactFlowProvider>
      <MetaphysicsCanvas />
    </ReactFlowProvider>
  )
}
