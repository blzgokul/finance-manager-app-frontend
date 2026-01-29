import { useState } from "react";
import API from "../api/axios";

export default function GoalForm({ onAdded }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const submitGoal = async () => {
    if (!title || !targetAmount || !deadline) return;

    await API.post("/api/goals", {
      title,
      targetAmount,
      deadline,
    });

    setTitle("");
    setTargetAmount("");
    setDeadline("");
    onAdded(); // refresh list
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <h2 className="text-lg font-bold mb-3">➕ Add Financial Goal</h2>

      <div className="flex gap-2 flex-wrap">
        <input
          className="border p-2"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Target ₹"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <input
          type="date"
          className="border p-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={submitGoal}
          className="bg-blue-600 text-white px-4"
        >
          Add Goal
        </button>
      </div>
    </div>
  );
}