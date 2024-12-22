import { ReactElement } from 'react'
import { Cell } from '../../core/Cell'
import { PlayerOrder } from '../../core/Player'
import './Cell.css'

interface CellComponentProps {
  cell: Cell
}

export function CellComponent({ cell }: CellComponentProps): ReactElement {
  return (
    <div>
      {typeof cell.content === 'undefined' ? (
        <EmptyCell />
      ) : (
        <OccupiedCell player={cell.content} />
      )}
    </div>
  )
}

function EmptyCell(): ReactElement {
  return <div className="cell empty"></div>
}

function OccupiedCell({ player }: { player: PlayerOrder }): ReactElement {
  return (
    <div
      className={`cell stone ${player === PlayerOrder.First ? 'white' : 'black'}`}
    ></div>
  )
}
