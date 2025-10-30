import { checkCollision } from './board.js';
import { COLORS, COLS, SHAPES } from './constants.js';

export function createPiece() {
  const index = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  const shape = SHAPES[index];
  return {
    shape: shape,
    color: COLORS[index],
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0
  };
}

export function rotatePiece(piece, board) {
  const N = piece.shape.length;
  const newShape = Array.from({ length: N }, () => Array(N).fill(0));

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      newShape[x][N - 1 - y] = piece.shape[y][x];
    }
  }

  let kick = 0;
  if (checkCollision(board, newShape, piece.x, piece.y)) {
    kick = 1;
    if (checkCollision(board, newShape, piece.x + kick, piece.y)) {
      kick = -1;
      if (checkCollision(board, newShape, piece.x + kick, piece.y)) {
        kick = -2;
        if (checkCollision(board, newShape, piece.x + kick, piece.y)) {
          return null;
        }
      }
    }
  }

  return {
    ...piece,
    shape: newShape,
    x: piece.x + kick
  };
}