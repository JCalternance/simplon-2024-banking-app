import { apiFetch } from './api.js';
import { openLocalDb } from './localDb.js'

export const getCategories = () => apiFetch('/categories');
export async function createCategory(categoryDTO) {

    return apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryDTO),
    })
}

export const deleteCategory = (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' });