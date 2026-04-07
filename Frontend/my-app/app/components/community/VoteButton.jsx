"use client";

import { useState } from "react";

export default function VoteButton({ initialVotes }) {
  const [votes, setVotes] = useState(initialVotes);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setVotes(votes + 1)}
        className="bg-gray-200 px-2 py-1 rounded"
      >
        ⬆
      </button>
      <span>{votes}</span>
    </div>
  );
}