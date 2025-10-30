import { COLORS, NEXT_PIECE_CANVAS_SIZE } from './constants.js';

function drawBlock(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.strokeRect(x, y, 1, 1);
}

export function drawBoard(ctx, board) {
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        drawBlock(ctx, x, y, COLORS[value]);
      }
    });
  });
}

export function drawPiece(ctx, piece) {
  const { shape, color, x, y } = piece;
  shape.forEach((row, rowY) => {
    row.forEach((value, colX) => {
      if (value !== 0) {
        drawBlock(ctx, x + colX, y + rowY, color);
      }
    });
  });
}

export function drawNextPiece(ctx, piece) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (!piece) return;

  const { shape, color } = piece;
  const N = shape.length;
  const x = (NEXT_PIECE_CANVAS_SIZE - N) / 2;
  const y = (NEXT_PIECE_CANVAS_SIZE - N) / 2;
  shape.forEach((row, rowY) => {
    row.forEach((value, colX) => {
      if (value !== 0) {
        drawBlock(ctx, x + colX, y + rowY, color);
      }
    });
  });
}