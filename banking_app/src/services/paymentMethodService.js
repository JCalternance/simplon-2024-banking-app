import { apiFetch} from "./api.js";

export const getPaymentMethods = () => apiFetch('/payment-methods');
export const createPaymentMethod = (pmDTO) => apiFetch('/payment-methods', {
    method: 'POST',
    body: JSON.stringify(pmDTO),
});
export const deletePaymentMethod = (id) => apiFetch(`/payment-methods/${id}`, { method: 'DELETE' });