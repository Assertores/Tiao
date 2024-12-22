import { ReactElement } from 'react'
import { Board } from '../../core/Board'
import { Cell } from '../../core/Cell'
import { CellComponent } from './CellComponent'

interface BoardComponentProps {
  board: Board
}

export function BoardComponent({ board }: BoardComponentProps): ReactElement {
  const cells: Cell[][] = []
  for (let y = 0; y < board.size.y; y++) {
    cells[y] = []
    for (let x = 0; x < board.size.x; x++) {
      cells[y][x] = board.get({ x, y })
    }
  }

  return (
    <div>
      {cells.map((cellRow, rowNumber) => (
        <div
          key={rowNumber}
          style={{
            display: 'flex',
          }}
        >
          {cellRow.map((cell) => (
            <div key={`${cell.position.x},${cell.position.y}`}>
              <CellComponent cell={cell} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
