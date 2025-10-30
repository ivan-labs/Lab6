import { COLORS, COLS, ROWS } from './constants.js';

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function checkCollision(board, shape, x, y) {
  for (let rowY = 0; rowY < shape.length; rowY++) {
    for (let colX = 0; colX < shape[rowY].length; colX++) {
      if (shape[rowY][colX] !== 0) {
        const boardX = x + colX;
        const boardY = y + rowY;
        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
          return true;
        }
        if (boardY >= 0 && board[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

export function lockPiece(board, piece) {
  const { shape, x, y, color } = piece;
  const colorIndex = COLORS.indexOf(color);
  shape.forEach((row, rowY) => {
    row.forEach((value, colX) => {
      if (value !== 0) {
        if (y + rowY >= 0) {
          board[y + rowY][x + colX] = colorIndex;
        }
      }
    });
  });
}
export function clearLines(board) {
  let linesToClear = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      linesToClear++;
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      y++;
    }
  }
  return linesToClear;
}