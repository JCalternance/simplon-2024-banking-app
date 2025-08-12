import React, {useState, useEffect} from 'react';
import {getCategories, createCategory, deleteCategory} from '../services/categoryService.js';
import './category.css'
import DeleteButton from "./commons/deleteButton/DeleteButton.jsx";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (e) {
            alert('Erreur chargement catégories: ' + e.message);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        try {
            await createCategory({name, color});
            setName('');
            setColor('#000000');
            loadCategories();
        } catch (e) {
            alert('Erreur création: ' + e.message);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Supprimer cette catégorie ?')) return;
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (e) {
            alert('Erreur suppression: ' + e.message);
        }
    }

    return (
        <div>
            <h2>Catégories</h2>
            <form className="form-category" onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Nom catégorie"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <div className="color-container">
                    <label>Couleur</label>
                    <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        required
                    /></div>
                <button type="submit">Ajouter</button>
            </form>
            <table className="table">
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id}>
                            <td>
                                <span className="cat-badge" style={{background: cat.color}}>{cat.name}</span>
                            </td>
                            <td>
                                <DeleteButton onClick={() => handleDelete(cat.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
