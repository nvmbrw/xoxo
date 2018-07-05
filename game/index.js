import { Map } from 'immutable'

const MOVE = 'MOVE'

const turnReducer = (turn = 'X', action) => {
  if (action.type === MOVE) {
    return turn === 'X' ? 'O' : 'X'
  }
}

const boardReducer = (board = Map(), action) => {}

export default function gameReducer(
  prevState = { board: Map(), turn: 'O' },
  action
) {
  switch (action.type) {
    case 'MOVE':
      let newBoard = {
        board: prevState.board.setIn(action.position, action.player),
        turn: action.player === 'X' ? 'O' : 'X',
      }
      return newBoard
    default:
      return prevState
  }
}

export function move(player, coords) {
  return { type: 'MOVE', position: coords, player: player }
}

function streak(board, firstCoord, ...remainingCoords) {
  const value = board.getIn(firstCoord)

  for (let i = 0; i < remainingCoords.length; i++) {
    if (board.getIn(remainingCoords[i]) !== value) return undefined
  }
  return value
}

export function winner(board) {
  for (let i = 0; i < 3; i++) {
    let strk = streak(board, [i, 0], [i, 1], [i, 2])
    if (strk) return strk
  }

  for (let i = 0; i < 3; i++) {
    let strk = streak(board, [0, i], [1, i], [2, i])
    if (strk) return strk
  }
  let strk = streak(board, [0, 0], [1, 1], [2, 2])
  if (strk) {
    return strk
  } else {
    return streak(board, [2, 0], [1, 1], [0, 2])
  }
}
