import { displayHighScores, saveHighScore, updateScore } from './score.js';
import { checkCollision, clearLines, createBoard, lockPiece } from './board.js';
import { drawBoard, drawNextPiece, drawPiece } from './draw.js';
import { createPiece, rotatePiece } from './piece.js';
import { COLS, ROWS, BLOCK_SIZE, NEXT_PIECE_CANVAS_SIZE } from "./constants.js";
import "./style.css"

const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const usernameInput = document.getElementById('username-input');
const startGameBtn = document.getElementById('start-game-btn');
const usernameDisplay = document.getElementById('username-display');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const mainCanvas = document.getElementById('tetris-canvas');
const mainCtx = mainCanvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece-canvas');
const nextCtx = nextCanvas.getContext('2d');
const gameOverModal = document.getElementById('game-over-modal');
const finalScore = document.getElementById('final-score');
const highScoresList = document.getElementById('high-scores-list');
const restartGameBtn = document.getElementById('restart-game-btn');

let board;
let score;
let level;
let linesCleared;
let isGameOver = true;
let username;
let currentPiece;
let nextPiece;
let fallSpeed;
let fallCounter;
let lastTime;
let animationFrameId;

function setupCanvases() {
    mainCanvas.width = COLS * BLOCK_SIZE;
    mainCanvas.height = ROWS * BLOCK_SIZE;
    mainCtx.scale(BLOCK_SIZE, BLOCK_SIZE);

    const nextBlockSize = nextCanvas.width / NEXT_PIECE_CANVAS_SIZE;
    nextCtx.scale(nextBlockSize, nextBlockSize);
}


function startGame() {
    username = usernameInput.value || 'Гість';
    if (username.trim() === '') {
        usernameInput.classList.add('border-red-500', 'ring-red-500');
        usernameInput.focus();
        return;
    }
    usernameInput.classList.remove('border-red-500', 'ring-red-500');
    usernameDisplay.textContent = username;

    loginScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    gameOverModal.style.display = 'none';

    initGame();
}

function initGame() {
    board = createBoard();
    score = 0;
    level = 1;
    linesCleared = 0;
    isGameOver = false;
    fallSpeed = 1000;
    fallCounter = 0;
    lastTime = 0;

    nextPiece = createPiece();
    spawnNewPiece();
    updateScoreboard();

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gameLoop(0);
}

function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece();
    drawNextPiece(nextCtx, nextPiece);

    if (checkCollision(board, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        handleGameOver();
    }
}

function gameLoop(time) {
    if (isGameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;
    fallCounter += deltaTime;

    if (fallCounter > fallSpeed) {
        movePieceDown();
        fallCounter = 0;
    }

    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function movePieceDown() {
    if (checkCollision(board, currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        lockPiece(board, currentPiece);
        const lines = clearLines(board);
        if (lines > 0) {
            const { newScore, newLevel, newLinesCleared, newFallSpeed } = updateScore(score, level, linesCleared, lines);
            score = newScore;
            level = newLevel;
            linesCleared = newLinesCleared;
            fallSpeed = newFallSpeed;
            updateScoreboard();
        }
        spawnNewPiece();
    } else {
        currentPiece.y++;
    }
}

function hardDrop() {
    while (!checkCollision(board, currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    }
    movePieceDown();
}

function handleGameOver() {
    isGameOver = true;
    cancelAnimationFrame(animationFrameId);
    finalScore.textContent = score;
    saveHighScore(score, username);
    displayHighScores(highScoresList);
    gameOverModal.style.display = 'flex';
}

function updateScoreboard() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
}

function draw() {
    mainCtx.fillStyle = '#1e293b';
    mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    drawBoard(mainCtx, board);
    drawPiece(mainCtx, currentPiece);
}

function handleKeydown(event) {
    if (isGameOver) return;

    switch (event.key) {
        case 'ArrowLeft':
            if (!checkCollision(board, currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
                currentPiece.x--;
            }
            break;
        case 'ArrowRight':
            if (!checkCollision(board, currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
                currentPiece.x++;
            }
            break;
        case 'ArrowDown':
            movePieceDown();
            fallCounter = 0;
            break;
        case 'ArrowUp':
            const rotated = rotatePiece(currentPiece, board);
            if (rotated) {
                currentPiece = rotated;
            }
            break;
        case ' ':
            event.preventDefault();
            hardDrop();
            break;
    }
    if (!isGameOver) {
        draw();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupCanvases();
    startGameBtn.addEventListener('click', startGame);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGame();
    });
    restartGameBtn.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
        initGame();
    });
    document.addEventListener('keydown', handleKeydown);
});