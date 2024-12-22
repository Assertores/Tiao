import { ReactElement } from 'react'
import { Cell } from '../../core/Cell'
import { PlayerOrder } from '../../core/Player'
import './Cell.css'
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
    <button
      type="button"
      onClick={onClick}
      className={classNames('cell', {
        'empty': cell.content === undefined,
        'stone white': cell.content === PlayerOrder.First,
        'stone black': cell.content === PlayerOrder.Second,
      })}
    ></button>
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
