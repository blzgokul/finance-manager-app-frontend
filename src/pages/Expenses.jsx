import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Expense() {
  const [expenses, setExpenses] = useState([]);

  // filters
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // edit
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    category: "",
    amount: "",
    date: "",
  });

  /* =========================
     FETCH EXPENSES
  ========================== */
  const fetchExpenses = async () => {
    const params = {};
    if (filterCategory) params.category = filterCategory;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await API.get("/api/expenses", { params });
    setExpenses(res.data);
  };

  /* =========================
     INITIAL LOAD
  ========================== */
  useEffect(() => {
    fetchExpenses();
  }, []);

  /* =========================
     UPDATE EXPENSE
  ========================== */
  const saveEdit = async () => {
    if (!editForm.category || !editForm.amount || !editForm.date) {
      alert("All fields required");
      return;
    }

    await API.put(`/api/expenses/${editId}`, editForm);

    setEditId(null);
    setEditForm({ category: "", amount: "", date: "" });
    fetchExpenses();
  };

  /* =========================
     DELETE EXPENSE
  ========================== */
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    await API.delete(`/api/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-16">
      <h2 className="text-2xl font-bold mb-4">💸 Expenses</h2>

      {/* FILTERS */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />

        <input
          type="date"
          className="border p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={fetchExpenses} className="border">
          Apply
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Category</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No expenses found
              </td>
            </tr>
          ) : (
            expenses.map((e) => (
              <tr key={e._id}>
                {editId === e._id ? (
                  <>
                    <td className="border p-2">
                      <input
                        className="border p-1 w-full"
                        value={editForm.category}
                        onChange={(ev) =>
                          setEditForm({
                            ...editForm,
                            category: ev.target.value,
                          })
                        }
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="date"
                        className="border p-1 w-full"
                        value={editForm.date}
                        onChange={(ev) =>
                          setEditForm({
                            ...editForm,
                            date: ev.target.value,
                          })
                        }
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="number"
                        className="border p-1 w-full"
                        value={editForm.amount}
                        onChange={(ev) =>
                          setEditForm({
                            ...editForm,
                            amount: ev.target.value,
                          })
                        }
                      />
                    </td>

                    <td className="border p-2">
                      <button
                        onClick={saveEdit}
                        className="text-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditId(null)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{e.category}</td>
                    <td className="border p-2">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">₹{e.amount}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => {
                          setEditId(e._id);
                          setEditForm({
                            category: e.category,
                            amount: e.amount,
                            date: e.date.slice(0, 10),
                          });
                        }}
                        className="mr-3"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteExpense(e._id)}
                        className="text-red-600"
                      >
                        🗑
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}