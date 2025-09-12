"use client";

import { useState } from "react";

const BOARD_SIZE = 8;

// 0: empty, 1: black, -1: white
 type Cell = 0 | 1 | -1;

function createInitialBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array<Cell>(BOARD_SIZE).fill(0)
  );
  board[3][3] = -1;
  board[3][4] = 1;
  board[4][3] = 1;
  board[4][4] = -1;
  return board;
}

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

function inBounds(x: number, y: number) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function getFlips(board: Cell[][], x: number, y: number, player: Cell) {
  if (board[y][x] !== 0) return [] as [number, number][];
  const opponent = (player * -1) as Cell;
  const flips: [number, number][] = [];
  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    const line: [number, number][] = [];
    while (inBounds(nx, ny) && board[ny][nx] === opponent) {
      line.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
    if (line.length && inBounds(nx, ny) && board[ny][nx] === player) {
      flips.push(...line);
    }
  }
  return flips;
}

function hasValidMove(board: Cell[][], player: Cell) {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (getFlips(board, x, y, player).length) return true;
    }
  }
  return false;
}

export default function OthelloGame() {
  const [board, setBoard] = useState<Cell[][]>(createInitialBoard);
  const [player, setPlayer] = useState<Cell>(1);

  const handleClick = (x: number, y: number) => {
    const flips = getFlips(board, x, y, player);
    if (!flips.length) return;
    const newBoard = board.map((row) => row.slice());
    newBoard[y][x] = player;
    flips.forEach(([fx, fy]) => {
      newBoard[fy][fx] = (newBoard[fy][fx] * -1) as Cell;
    });
    const next = (player * -1) as Cell;
    setBoard(newBoard);
    if (hasValidMove(newBoard, next)) {
      setPlayer(next);
    } else if (!hasValidMove(newBoard, player)) {
      // No moves for either player
      setPlayer(0);
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setPlayer(1);
  };

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        {player === 0
          ? "ゲーム終了"
          : `現在の手番: ${player === 1 ? "黒" : "白"}`}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)`,
          gap: 2,
          background: "#006400",
          padding: 2,
          width: "fit-content",
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => {
            const flips = getFlips(board, x, y, player);
            const canPlay = player !== 0 && flips.length > 0;
            return (
              <div
                key={`${x}-${y}`}
                onClick={() => handleClick(x, y)}
                style={{
                  width: 40,
                  height: 40,
                  background: "#008000",
                  position: "relative",
                  cursor: canPlay ? "pointer" : "default",
                  border: "1px solid #004d00",
                }}
              >
                {cell !== 0 && (
                  <div
                    style={{
                      background: cell === 1 ? "#000" : "#fff",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      margin: "5px auto",
                    }}
                  />
                )}
                {cell === 0 && canPlay && (
                  <div
                    style={{
                      background: player === 1 ? "#000" : "#fff",
                      opacity: 0.3,
                      borderRadius: "50%",
                      width: 10,
                      height: 10,
                      margin: "15px auto",
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      <button onClick={resetGame} style={{ marginTop: 12 }}>
        リセット
      </button>
    </div>
  );
}

