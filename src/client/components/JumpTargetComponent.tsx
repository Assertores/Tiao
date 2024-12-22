import { ReactElement } from 'react'
import { Position } from '../../core/Position'
import { CELL_SIZE } from '../settings'

export const enum JumpTargetType {
  Origin = 'origin',
  Destination = 'destination',
  Victim = 'victim',
}

export interface JumpTargetComponentProps {
  position: Position
  type: JumpTargetType
  onClick?: () => void
}

export function JumpTargetComponent({
  position,
  type,
  onClick,
}: JumpTargetComponentProps): ReactElement {
  let background: string | undefined = undefined

  switch (type) {
    case JumpTargetType.Destination:
      background = 'rgb(0 255 0 / 40%'
      break
    case JumpTargetType.Victim:
      background = 'rgb(255 0 0 / 40%'
      break
    case JumpTargetType.Origin:
    default:
      background = undefined
      break
  }

  return (
    <button
      style={{
        position: 'absolute',
        top: `${position.y * CELL_SIZE}px`,
        left: `${position.x * CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
        width: `${CELL_SIZE}px`,
        borderRadius: '50%',
        padding: 0,
        margin: 0,
        border: 0,
        background,
        pointerEvents: !onClick ? 'none' : undefined,
      }}
      onClick={onClick}
    ></button>
  )
}
