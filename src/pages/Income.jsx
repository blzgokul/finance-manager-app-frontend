import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Income() {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [incomes, setIncomes] = useState([]);

  // Fetch income list
  const fetchIncomes = async () => {
    try {
      const res = await API.get("/api/income");
      setIncomes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const addIncome = async () => {
    if (!source || !amount) {
      alert("All fields required");
      return;
    }

    try {
      await API.post("/api/income", {
        source,
        amount,
      });

      alert("Income added successfully");
      setSource("");
      setAmount("");
      fetchIncomes(); // ✅ refresh list
    } catch (err) {
      alert("Failed to add income");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Income</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Income source (e.g. Salary)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={addIncome}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Income
      </button>

      <h3 className="text-lg font-bold mt-6">Income List</h3>

      {incomes.map((inc) => (
        <div
          key={inc._id}
          className="border p-2 mt-2 flex justify-between"
        >
          <span>{inc.source}</span>
          <span>₹ {inc.amount}</span>
        </div>
      ))}
    </div>
  );
}
