import { Map } from 'immutable'

const MOVE = 'MOVE'
const COORDS = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
]

const bad = (state, action) => {
  if (action.player !== state.turn) {
    return `${action.player}, it's not your turn!`
  } else if (
    !Array.isArray(action.position) ||
    isNaN(action.position[0]) ||
    isNaN(action.position[1]) ||
    action.position[0] > 2 ||
    action.position[0] < 0 ||
    action.position[1] > 2 ||
    action.position[1] < 0
  ) {
    return `Invalid input: ${action.position}`
  } else if (state.board.getIn(action.position)) {
    return `Space ${
      action.position
    } has been previously played in with ${state.board.getIn(action.position)}`
  } else return null
}

const turnReducer = (turn = 'O', action) => {
  if (action.type === MOVE) return turn === 'X' ? 'O' : 'X'
  else return turn
}

const boardReducer = (board = Map(), action) => {
  if (action.type === MOVE) return board.setIn(action.position, action.player)
  else return board
}

export default function reducer(prevState = {}, action) {
  if (action.player) {
    const error = bad(prevState, action)
    if (error) return Object.assign({}, prevState, { error })
  }

  const nextBoard = boardReducer(prevState.board, action)
  let winnerState = winner(nextBoard)
  if (
    !winnerState &&
    COORDS.filter(coord => !typeof nextBoard.getIn(coord) === 'string').length
  )
    console.log(nextBoard)
  winnerState = 'draw'

  return {
    board: nextBoard,
    turn: turnReducer(prevState.turn, action),
    winner: winnerState,
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
