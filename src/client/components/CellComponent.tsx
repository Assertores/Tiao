import { ReactElement } from 'react'
import { Cell } from '../../core/Cell'
import { PlayerOrder } from '../../core/Player'
import classNames from 'classnames'

interface CellComponentProps {
  cell: Cell
  onClick: () => void
}

export function CellComponent({
  cell,
  onClick,
}: CellComponentProps): ReactElement {
  return (
    <button type="button" onClick={onClick} className="cell">
      {cell.content !== undefined ? <Stone player={cell.content} /> : null}
    </button>
  )
}

function Stone({ player }: { player: PlayerOrder }): ReactElement {
  return (
    <div
      className={`stone ${player === PlayerOrder.First ? 'white' : 'black'}`}
    ></div>
  )
}
