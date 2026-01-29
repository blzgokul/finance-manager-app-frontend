import { useEffect, useState } from "react";
import API from "../api/axios";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Reports() {
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const navigate = useNavigate();

  /* ======================
     AUTH + FETCH REPORTS
  ======================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // 🔹 Expense summary (from reports controller)
      const expenseRes = await API.get(
        "/api/reports/expenses/summary"
      );

      // 🔹 Income vs Expense totals
      const incomeExpenseRes = await API.get(
        "/api/reports/income-vs-expense"
      );

      setExpenseSummary(expenseRes.data);
      setTotalExpense(incomeExpenseRes.data.expense);
      setTotalIncome(incomeExpenseRes.data.income);
    } catch (err) {
      console.error("Failed to load reports", err);
    }
  };

 // ======================
// DOWNLOAD HANDLERS (FIXED)
// ======================
const downloadCSV = async () => {
  try {
    const res = await API.get(
      "/api/reports/expenses/export/csv",
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("CSV download failed", err);
  }
};

const downloadPDF = async () => {
  try {
    const res = await API.get(
      "/api/reports/expenses/export/pdf",
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses-report.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("PDF download failed", err);
  }
};

  /* ======================
     CHART DATA
  ======================= */
  const expenseChartData = {
    labels: expenseSummary.map((e) =>
      e._id.charAt(0).toUpperCase() + e._id.slice(1)
    ),
    datasets: [
      {
        data: expenseSummary.map((e) => e.total),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#22c55e",
          "#3b82f6",
        ],
      },
    ],
  };

  const incomeVsExpenseData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        <h1 className="text-2xl font-bold">📊 Financial Reports</h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded shadow text-center">
          <div>
            Total Income <br />
            <b>₹{totalIncome}</b>
          </div>
          <div>
            Total Expense <br />
            <b>₹{totalExpense}</b>
          </div>
          <div>
            Savings <br />
            <b>₹{totalIncome - totalExpense}</b>
          </div>
        </div>

        {/* DOWNLOAD BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={downloadCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ⬇ Download CSV
          </button>

          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ⬇ Download PDF
          </button>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-bold mb-4">Expense Distribution</h2>
            <Pie data={expenseChartData} />
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-bold mb-4">Income vs Expense</h2>
            <Bar data={incomeVsExpenseData} />
          </div>
        </div>

        {/* EXPENSE TABLE */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold mb-4">Expense Breakdown</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Category</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {expenseSummary.map((e) => (
                <tr key={e._id} className="text-center">
                  <td className="border p-2">
                    {e._id.charAt(0).toUpperCase() + e._id.slice(1)}
                  </td>
                  <td className="border p-2">₹{e.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}