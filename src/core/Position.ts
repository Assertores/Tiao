export interface Position {
  readonly x: number // int
  readonly y: number // int
}

export function comparePositions(lhs: Position, rhs: Position): boolean {
  return lhs.x === rhs.x && lhs.y === rhs.y
}
