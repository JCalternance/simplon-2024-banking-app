import { apiFetch} from "./api.js";
import { openLocalDb } from './localDb.js'


export const getTransactions = () => apiFetch('/transactions');

export async function createTransaction(transactionDTO) {

    return apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionDTO),
    })
}

export const deleteTransaction = (id) => apiFetch(`/transactions/${id}`, { method: 'DELETE' });