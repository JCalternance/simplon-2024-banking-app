import React, { useState, useEffect } from 'react';
import { getPaymentMethods, createPaymentMethod, deletePaymentMethod } from '../services/paymentMethodService.js';
import DeleteButton from "./commons/deleteButton/DeleteButton.jsx";

export default function PaymentMethods() {
    const [methods, setMethods] = useState([]);
    const [name, setName] = useState('');
    const [lastDigits, setLastDigits] = useState('');

    useEffect(() => {
        loadMethods();
    }, []);

    async function loadMethods() {
        try {
            const data = await getPaymentMethods();
            setMethods(data);
        } catch (e) {
            alert('Erreur chargement moyens de paiement: ' + e.message);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (lastDigits.length !== 4) {
            alert('Les 4 derniers chiffres sont obligatoires');
            return;
        }
        try {
            await createPaymentMethod({ name, lastDigits });
            setName('');
            setLastDigits('');
            loadMethods();
        } catch (e) {
            alert('Erreur création: ' + e.message);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Supprimer ce moyen de paiement ?')) return;
        try {
            await deletePaymentMethod(id);
            loadMethods();
        } catch (e) {
            alert('Erreur suppression: ' + e.message);
        }
    }

    return (
        <div>
            <h2>Moyens de paiement</h2>
            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="4 derniers chiffres"
                    value={lastDigits}
                    onChange={e => setLastDigits(e.target.value)}
                    maxLength={4}
                    required
                />
                <button type="submit">Ajouter</button>
            </form>
            <table className="table">
                <tbody>
                {methods.map(pm => (
                    <tr key={pm.id}>
                        <td>
                            <span style={{fontWeight: "bold"}}>{pm.name}</span>
                        </td>
                        <td>
                             - **** {pm.lastDigits}{' '}
                        </td>
                        <td>
                            <DeleteButton onClick={() => handleDelete(pm.id)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
