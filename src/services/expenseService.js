import API from "./api";

/**
 * Add Expense
 */
export const addExpense = (data) => {
  return API.post("/expenses", data);
};

/**
 * Get All Expenses
 */
export const getExpenses = () => {
  return API.get("/expenses");
};

/**
 * Monthly Summary
 */
export const getMonthlySummary = () => {
  return API.get("/expenses/summary/monthly");
};

/**
 * Update Expense
 */
export const updateExpense = (id, data) => {
  return API.put(`/expenses/${id}`, data);
};

/**
 * Delete Expense
 */
export const deleteExpense = (id) => {
  return API.delete(`/expenses/${id}`);
};