import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ExpenseChart from "../components/ExpenseChart";
import BudgetList from "../components/BudgetList";
import GoalForm from "../components/GoalForm";
import GoalList from "../components/GoalList";
import BudgetForm from "../components/BudgetForm";

export default function Dashboard() {
  const navigate = useNavigate();

  // ===== FORM STATE =====
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("income");
  const [isRecurring, setIsRecurring] = useState(false);
const [frequency, setFrequency] = useState("monthly");

  // ===== EDIT STATE =====
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState(null);

  // ===== DATA =====
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // ===== MONTHLY SUMMARY (NEW) =====
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // ===== FILTERS =====
  const [filterSource, setFilterSource] = useState("");
  const [incomeStartDate, setIncomeStartDate] = useState("");
  const [incomeEndDate, setIncomeEndDate] = useState("");

  const [filterCategory, setFilterCategory] = useState("");
  const [expenseStartDate, setExpenseStartDate] = useState("");
  const [expenseEndDate, setExpenseEndDate] = useState("");

  // ===== AUTH CHECK =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchAll();
    fetchMonthlySummary();
  }, []);

  const fetchAll = async () => {
    fetchIncomes();
    fetchExpenses();
  };

  const fetchIncomes = async () => {
    const params = {};
    if (filterSource) params.source = filterSource;
    if (incomeStartDate) params.startDate = incomeStartDate;
    if (incomeEndDate) params.endDate = incomeEndDate;

    const res = await API.get("/api/income", { params });
    setIncomes(res.data);
  };

  const fetchExpenses = async () => {
    const params = {};
    if (filterCategory) params.category = filterCategory;
    if (expenseStartDate) params.startDate = expenseStartDate;
    if (expenseEndDate) params.endDate = expenseEndDate;

    const res = await API.get("/api/expenses", { params });
    setExpenses(res.data);
  };

  // ===== MONTHLY SUMMARY API =====
  const fetchMonthlySummary = async () => {
    try {
      const res = await API.get("/api/expenses/summary/monthly");
      setMonthlySummary(res.data);
      setSummaryLoading(false);
    } catch (err) {
      console.error("Monthly Summary Error:", err);
      setSummaryLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate("");
    setType("income");
    setEditId(null);
    setEditType(null);
    setIsRecurring(false);
setFrequency("monthly")
  };

  const handleSubmit = async () => {
    if (!description || !amount || !date) {
      alert("All fields required");
      return;
    }

    if (editId) {
      if (editType === "income") {
        await API.put(`/api/income/${editId}`, {
          source: description,
          amount,
          date,
        });
      } else {
        await API.put(`/api/expenses/${editId}`, {
          category: description,
          amount,
          date,
        });
      }
    } else {
      if (type === "income") {
        await API.post("/api/income", {
          source: description,
          amount,
          date,
        });
      } else {
        await API.post("/api/expenses", {
  category: description.trim().toLowerCase(),
  amount,
  date,
  isRecurring,
  frequency: isRecurring ? frequency : null,
});
      }
    }

    resetForm();
    fetchAll();
    fetchMonthlySummary();
  };

  const deleteIncome = async (id) => {
    await API.delete(`/api/income/${id}`);
    fetchIncomes();
  };

  const deleteExpense = async (id) => {
    await API.delete(`/api/expenses/${id}`);
    fetchExpenses();
    fetchMonthlySummary();
  };

  const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
      <div className="bg-white p-6 rounded shadow flex justify-between items-center">
  <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>

  <div className="flex gap-4">
    <button
      onClick={() => navigate("/reports")}
      className="border px-4 py-1"
    >
      Reports
    </button>
    <button
  onClick={() => navigate("/budgets")}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Go to Budgets
</button>

    <button
      onClick={logout}
      className="border px-4 py-1"
    >
      Logout
    </button>
  </div>
</div>
        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded shadow text-center">
          <div>Income<br /><b>₹{totalIncome}</b></div>
          <div>Expense<br /><b>₹{totalExpense}</b></div>
          <div>Balance<br /><b>₹{balance}</b></div>
        </div>

        {/* MONTHLY SUMMARY (NEW) */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Monthly Expense Summary</h2>

          {summaryLoading && <p>Loading summary...</p>}

          {monthlySummary && (
            <>
              <h3 className="mb-4">Total: ₹{monthlySummary.total}</h3>
              <div className="flex gap-4 flex-wrap">
                {monthlySummary.breakdown.map(item => (
                  <div key={item._id} className="border p-4 rounded w-40">
                    <b>
  {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
</b>
                    <p>₹{item.total}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded shadow">
          <ExpenseChart expenses={expenses} />
        </div>

        {/* BUDGET & GOALS */}
        <div className="bg-white p-6 rounded shadow space-y-8">
          <BudgetForm onAdded={() => window.location.reload()} />
          <BudgetList />
          <hr />
          <GoalForm />
          <GoalList />
        </div>

        {/* ADD INCOME / EXPENSE */}
<div className="bg-white p-6 rounded shadow">
  <h2 className="text-xl font-bold mb-4">➕ Add Income / Expense</h2>

  <div className="grid grid-cols-12 gap-3">

    {/* DESCRIPTION / CATEGORY */}
    <input
      className="border p-2 col-span-4"
      placeholder={type === "income" ? "Income Source" : "Expense Category"}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    {/* DATE */}
    <input
      type="date"
      className="border p-2 col-span-2"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />

    {/* AMOUNT */}
    <input
      type="number"
      className="border p-2 col-span-2"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />

    {/* TYPE */}
    <select
      className="border p-2 col-span-2"
      value={type}
      onChange={(e) => setType(e.target.value)}
    >
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>

    {/* SUBMIT */}
    <button
      onClick={handleSubmit}
      className="border col-span-2 bg-black text-white rounded"
    >
      {editId ? "Update" : "Add"}
    </button>

    {/* RECURRING OPTIONS (ONLY FOR EXPENSE) */}
    {type === "expense" && (
      <div className="col-span-12 flex items-center gap-6 mt-3">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Recurring Expense
        </label>

        {isRecurring && (
          <select
            className="border p-2"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}
      </div>
    )}

  </div>
</div>
        {/* TABLES */}
        <div className="grid grid-cols-2 gap-10 bg-white p-6 rounded shadow">
          <div>
            <h2 className="font-bold mb-2">Income</h2>
            <table className="w-full border">
              <tbody>
                {incomes.map(i => (
                  <tr key={i._id}>
                    <td>{i.source}</td>
                    <td>{new Date(i.date).toLocaleDateString()}</td>
                    <td>₹{i.amount}</td>
                    <td><span onClick={() => deleteIncome(i._id)}>🗑</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EXPENSE TABLE */}
<div>
  <h2 className="font-bold mb-2">Expenses</h2>

  <table className="w-full border text-sm">
    <thead>
      <tr className="bg-gray-200 text-center">
        <th className="border p-2">Category</th>
        <th className="border p-2">Date</th>
        <th className="border p-2">Amount</th>
        <th className="border p-2">Type</th>
        <th className="border p-2">Action</th>
      </tr>
    </thead>

    <tbody>
      {expenses.map((e) => (
        <tr key={e._id} className="text-center">

          {/* CATEGORY */}
          <td className="border p-2">
            {e.category.charAt(0).toUpperCase() + e.category.slice(1)}
          </td>

          {/* DATE */}
          <td className="border p-2">
            {new Date(e.date).toLocaleDateString()}
          </td>

          {/* AMOUNT */}
          <td className="border p-2">₹{e.amount}</td>

          {/* RECURRING INFO */}
          <td className="border p-2">
            {e.isRecurring ? (
              <span className="text-green-600 font-semibold">
                🔁 {e.frequency}
              </span>
            ) : (
              <span className="text-gray-500">One-time</span>
            )}
          </td>

          {/* DELETE */}
          <td className="border p-2">
            <span
              className="cursor-pointer text-red-600"
              onClick={() => deleteExpense(e._id)}
            >
              🗑
            </span>
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>

      </div>
    </div>
  );
}