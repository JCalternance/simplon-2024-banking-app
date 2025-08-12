import { apiFetch} from "./api.js";

export const getTransactions = () => apiFetch('/transactions');
export const createTransaction = (transactionDTO) => apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionDTO),
});
export const deleteTransaction = (id) => apiFetch(`/transactions/${id}`, { method: 'DELETE' });