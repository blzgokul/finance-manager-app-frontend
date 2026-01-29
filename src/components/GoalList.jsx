import { useEffect, useState } from "react";
import API from "../api/axios";

export default function GoalList() {
  const [goals, setGoals] = useState([]);

  // edit goal details
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // edit saved amount
  const [editSavedId, setEditSavedId] = useState(null);
  const [savedEditValue, setSavedEditValue] = useState("");

  /* =========================
     FETCH GOALS
  ========================== */
  const fetchGoals = async () => {
    const res = await API.get("/api/goals");
    setGoals(res.data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  /* =========================
     SAVE SAVED AMOUNT (DIRECT)
  ========================== */
  const saveSavedAmount = async (goalId) => {
    const amount = Number(savedEditValue);
    if (amount < 0) return;

    await API.put(`/api/goals/${goalId}`, {
      savedAmount: amount,
    });

    setEditSavedId(null);
    setSavedEditValue("");
    fetchGoals();
  };

  /* =========================
     SAVE GOAL EDIT
  ========================== */
  const saveEdit = async (id) => {
    await API.put(`/api/goals/${id}`, editForm);
    setEditId(null);
    setEditForm({});
    fetchGoals();
  };

  /* =========================
     DELETE GOAL
  ========================== */
  const deleteGoal = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (!confirmDelete) return;

    await API.delete(`/api/goals/${id}`);
    fetchGoals();
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">🎯 Financial Goals</h2>

      {goals.length === 0 ? (
        <p className="text-gray-500">No financial goals added yet.</p>
      ) : (
        goals.map((g) => {
          const progress = Math.min(
            Math.round((g.savedAmount / g.targetAmount) * 100),
            100
          );

          const completed = g.savedAmount >= g.targetAmount;

          return (
            <div
              key={g._id}
              className={`border p-4 rounded mb-4 ${
                completed ? "bg-green-50 border-green-400" : ""
              }`}
            >
              {/* HEADER */}
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{g.title}</h3>
                {completed && (
                  <span className="text-green-600 font-semibold">
                    ✅ Completed
                  </span>
                )}
              </div>

              {/* EDIT GOAL MODE */}
              {editId === g._id ? (
                <div className="flex gap-2 flex-wrap mb-3">
                  <input
                    className="border p-1"
                    defaultValue={g.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    className="border p-1"
                    defaultValue={g.targetAmount}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        targetAmount: e.target.value,
                      })
                    }
                  />

                  <input
                    type="date"
                    className="border p-1"
                    defaultValue={g.deadline.slice(0, 10)}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        deadline: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() => saveEdit(g._id)}
                    className="bg-green-600 text-white px-3"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditId(null)}
                    className="border px-3"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {/* DETAILS */}
                  <p>Target: ₹{g.targetAmount}</p>

                  {/* SAVED AMOUNT EDIT */}
                  {editSavedId === g._id ? (
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="number"
                        className="border p-1 w-32"
                        value={savedEditValue}
                        onChange={(e) =>
                          setSavedEditValue(e.target.value)
                        }
                      />
                      <button
                        onClick={() => saveSavedAmount(g._id)}
                        className="bg-green-600 text-white px-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditSavedId(null);
                          setSavedEditValue("");
                        }}
                        className="border px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p>
                      Saved: ₹{g.savedAmount}
                      <button
                        onClick={() => {
                          setEditSavedId(g._id);
                          setSavedEditValue(g.savedAmount);
                        }}
                        className="text-blue-600 text-sm ml-2"
                      >
                        ✏️ Edit
                      </button>
                    </p>
                  )}

                  <p>
                    Deadline:{" "}
                    {new Date(g.deadline).toLocaleDateString()}
                  </p>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-200 h-3 rounded my-2">
                    <div
                      className={`h-3 rounded ${
                        completed ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditId(g._id);
                        setEditForm(g);
                      }}
                      className="border px-3"
                    >
                      Edit Goal
                    </button>

                    <button
                      onClick={() => deleteGoal(g._id)}
                      className="border px-3 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}