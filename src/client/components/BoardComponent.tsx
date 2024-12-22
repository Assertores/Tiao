import { ReactElement, useCallback, useState } from 'react'
import { Board } from '../../core/Board'
import { Cell } from '../../core/Cell'
import { CellComponent } from './CellComponent'
import { useGameManager } from '../GameContext'
import { JumpTarget } from '../../core/JumpTarget'
import { JumpTargetComponent, JumpTargetType } from './JumpTargetComponent'

interface BoardComponentProps {
  board: Board
}

export function BoardComponent({ board }: BoardComponentProps): ReactElement {
  const gameManager = useGameManager()
  const [placingStone, setPlacingStone] = useState<boolean>(false)
  const [jumpTargets, setJumpTargets] = useState<JumpTarget[]>([])

  const cells: Cell[][] = []
  for (let y = 0; y < board.size.y; y++) {
    cells[y] = []
    for (let x = 0; x < board.size.x; x++) {
      cells[y][x] = board.get({ x, y })
    }
  }

  const isSubmitDisabled = !gameManager.IsMyTurn()
  const submitMove = useCallback(() => {
    return gameManager.endTurn()
  }, [gameManager])

  return (
    <div>
      {placingStone ? 'Placing stone...' : null}
      <div className="board">
        <div>
          {cells.map((cellRow, rowNumber) => (
            <div
              key={rowNumber}
              style={{
                display: 'flex',
              }}
            >
              {cellRow.map((cell) => (
                <CellComponent
                  key={`${cell.position.x},${cell.position.y}`}
                  cell={cell}
                  onClick={async () => {
                    if (placingStone) {
                      await gameManager.place(cell)
                      setPlacingStone(false)
                    } else {
                      const jumpTargets = board.jumpTargets(
                        gameManager.me!.playerOrder,
                        cell.position,
                      )
                      setJumpTargets(jumpTargets)
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {jumpTargets.map((target) => (
            <>
              <JumpTargetComponent
                position={target.destination}
                type={JumpTargetType.Destination}
                onClick={async () => {
                  await gameManager.jump(target)
                  setJumpTargets([])
                }}
              />
              <JumpTargetComponent
                position={target.victim}
                type={JumpTargetType.Victim}
              />
              {/* <JumpTargetComponent
                position={target.origin}
                type={JumpTargetType.Origin}
              /> */}
            </>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPlacingStone((oldValue) => !oldValue)}
        disabled={!gameManager.IsMyTurn()}
      >
        Place Stone
      </button>
      <button disabled={isSubmitDisabled} onClick={submitMove}>
        Submit move
      </button>
    </div>
  )
}
