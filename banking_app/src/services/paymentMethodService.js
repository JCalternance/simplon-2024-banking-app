import { apiFetch} from "./api.js";
import { openLocalDb } from './localDb.js'

export const getPaymentMethods = () => apiFetch('/payment-methods');

export async function createPaymentMethod(paymentDTO) {

    return apiFetch('/payment-methods', {
        method: 'POST',
        body: JSON.stringify(paymentDTO),
    })
}

export const deletePaymentMethod = (id) => apiFetch(`/payment-methods/${id}`, { method: 'DELETE' });