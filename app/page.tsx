"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Player = "X" | "O";
type Cell = Player | null;

// The 8 ways to win: 3 rows, 3 columns, 2 diagonals (as board positions 0-8)
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}

const markColor: Record<Player, string> = {
  X: "text-[#e4572e]",
  O: "text-[#0f6e78]",
};

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, draws: 0, O: 0 });

  const result = getWinner(board);
  const isDraw = !result && board.every(Boolean);
  const gameOver = Boolean(result) || isDraw;
  const current: Player = xIsNext ? "X" : "O";

  function handleClick(index: number) {
    if (board[index] || gameOver) return;

    const next = board.slice();
    next[index] = current;
    setBoard(next);

    const winner = getWinner(next);
    if (winner) {
      setScores((s) => ({ ...s, [winner.player]: s[winner.player] + 1 }));
    } else if (next.every(Boolean)) {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    } else {
      setXIsNext(!xIsNext);
    }
  }

  function newGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetAll() {
    newGame();
    setScores({ X: 0, draws: 0, O: 0 });
  }

  const status = result
    ? `Player ${result.player} wins!`
    : isDraw
      ? "It's a draw"
      : `Player ${current}'s turn`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#eef2f6] px-4 py-10 text-slate-900">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tic-Tac-Toe
        </h1>
        <p className="mt-2 text-slate-600">Get three in a row to win.</p>
      </header>

      <p
        aria-live="polite"
        className={`text-xl font-semibold ${
          result ? markColor[result.player] : ""
        }`}
      >
        {status}
      </p>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-800 p-2 shadow-lg">
        {board.map((cell, i) => {
          const isWinning = result?.line.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              aria-label={`Square ${i + 1}${cell ? `, ${cell}` : ", empty"}`}
              className={`flex h-24 w-24 items-center justify-center rounded-lg text-6xl font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-28 sm:w-28 ${
                isWinning ? "bg-amber-200" : "bg-[#eef2f6] hover:bg-white"
              } ${cell ? markColor[cell] : ""} ${
                !cell && !gameOver ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Scoreboard */}
      <section aria-label="Score board" className="w-full max-w-sm">
        <div className="grid grid-cols-3 text-center">
          <div className="border-t-4 border-[#e4572e] pt-2">
            <p className="text-sm text-slate-600">Player X</p>
            <p className="text-3xl font-bold">{scores.X}</p>
          </div>
          <div className="border-t-4 border-slate-400 pt-2">
            <p className="text-sm text-slate-600">Draws</p>
            <p className="text-3xl font-bold">{scores.draws}</p>
          </div>
          <div className="border-t-4 border-[#0f6e78] pt-2">
            <p className="text-sm text-slate-600">Player O</p>
            <p className="text-3xl font-bold">{scores.O}</p>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button onClick={newGame}>New game</Button>
        <Button variant="outline" onClick={resetAll}>
          Reset all
        </Button>
      </div>

      <footer className="text-sm text-slate-500">
        Built with React 19, Next.js, Tailwind CSS, and shadcn/ui
      </footer>
    </main>
  );
}