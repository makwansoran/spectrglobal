import type { JSX } from 'react'
import type { Artifact } from '../../lib/artifacts'
import { artifactKey } from '../../lib/artifacts'
import ConfirmActionCard from './ConfirmActionCard'
import DecisionCard from './DecisionCard'
import TableArtifactView from './TableArtifactView'

function renderOne(artifact: Artifact): JSX.Element | null {
  switch (artifact.kind) {
    case 'decision':
      return <DecisionCard decisionId={artifact.decisionId} />
    case 'confirm':
      return <ConfirmActionCard confirmId={artifact.confirmId} />
    case 'table':
      return <TableArtifactView artifact={artifact} />
    default:
      return null
  }
}

/** Registry-style dispatch so new artifact kinds only need a case here. */
export default function ArtifactRenderer({ artifacts }: { artifacts: Artifact[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      {artifacts.map((a) => (
        <div key={artifactKey(a)}>{renderOne(a)}</div>
      ))}
    </div>
  )
}
