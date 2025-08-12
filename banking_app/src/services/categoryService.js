import { apiFetch } from './api.js';

export const getCategories = () => apiFetch('/categories');
export const createCategory = (categoryDTO) => apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryDTO),
});
export const deleteCategory = (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' });